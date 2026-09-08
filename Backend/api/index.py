import os
from typing import List, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Query, HTTPException, Response, logger
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from uuid import UUID
import asyncpg


# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is missing in .env")

# Global asyncpg connection pool reference
pool: Optional[asyncpg.Pool] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the asyncpg connection pool lifecycle.
    Initializes on server boot and closes connections gracefully on shutdown.
    """
    global pool
    try:
        pool = await asyncpg.create_pool(
            dsn=DATABASE_URL,
            min_size=1,
            max_size=5,          # Safe connection limit for serverless / Transaction Pooler
            timeout=10.0,
            command_timeout=5.0,# Keep query timeouts tight (<5s)
            statement_cache_size=0
        )
        print("Connected to Supabase PostgreSQL Pool.")
        yield
    finally:
        if pool:
            await pool.close()
            print("Closed Supabase PostgreSQL Pool.")


app = FastAPI(
    title="ABDM Global Doctor & Facility Search Engine",
    version="1.0.0",
    description="High-performance, location-aware search API powered by PostGIS & PL/pgSQL",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",  # Allows Vercel preview deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["*"] for public access, or `origins` array for stricter security
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to ABDM Doctor & Facility Search Engine API",
        "docs": "/docs",
        "health": "/healthz"
    }


@app.get("/healthz", tags=["Health"])
async def health_check():
    if not pool:
        raise HTTPException(
            status_code=503, 
            detail="Database connection pool unavailable"
        )
    return {"status": "healthy", "database": "connected"}

@app.get("/api/v1/search/doctors", tags=["Search"], response_class=Response)
async def search_doctors(
    lat: Optional[float] = Query(28.5355, description="Latitude (e.g. 28.5355 for Sarita Vihar, Delhi)"),
    lng: Optional[float] = Query(77.2845, description="Longitude (e.g. 77.2845 for Sarita Vihar, Delhi)"),
    radius_km: float = Query(10.0, ge=1.0, le=100.0, description="Search radius in kilometers"),
    specialties: Optional[str] = Query(None, description="e.g. Cardiology"),
    languages: Optional[List[str]] = Query(None, description="e.g. Hindi"),
    modes: Optional[List[str]] = Query(None, description="e.g. IN_CLINIC"),
    max_fee: Optional[float] = Query(None, description="Max Fee Filter"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Location-aware doctor search engine.
    Invokes PostGIS spatial filtering and returns raw JSON array directly from PostgreSQL.
    """
    if not pool:
        raise HTTPException(status_code=500, detail="Database pool is not initialized")

    # Note the explicit ::text cast at the end of the query
    query = """
    SELECT COALESCE(json_agg(doc_payload), '[]'::json)::text
    FROM (
        SELECT 
            d.id AS doctor_id,
            d.name AS doctor_name,
            d.photo,
            d.specialties,
            d.experience_years,
            d.verification_status,
            f.id AS facility_id,
            f.name AS facility_name,
            f.address,
            df.fee,
            df.modes,
            ROUND((ST_Distance(f.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000.0)::numeric, 2) AS distance_km
        FROM doctor_facility df
        JOIN doctor d ON df.doctor_id = d.id
        JOIN facility f ON df.facility_id = f.id
        WHERE df.active = TRUE
          AND f.status = 'ACTIVE'
          AND d.verification_status = 'VERIFIED'
          AND ST_DWithin(f.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3 * 1000)
          -- Trigram Fuzzy Search across Name & Specialties Array
          AND ($4::text IS NULL OR (
              d.name ILIKE '%' || $4 || '%' OR 
              array_to_string_immutable(d.specialties) ILIKE '%' || $4 || '%'
          ))
          AND ($5::text[] IS NULL OR d.languages @> $5)
          AND ($6::text[] IS NULL OR df.modes @> $6)
          AND ($7::numeric IS NULL OR df.fee <= $7)
        ORDER BY distance_km ASC
        LIMIT $8 OFFSET $9
    ) doc_payload;
    """

    try:
        async with pool.acquire() as connection:
            # fetchval returns a plain text string due to ::text cast
            json_str = await connection.fetchval(
                query,
                lng,          # $1 (Longitude / X-axis)
                lat,          # $2 (Latitude / Y-axis)
                radius_km,    # $3
                specialties,  # $4
                languages,    # $5
                modes,        # $6
                max_fee,      # $7
                limit,        # $8
                offset        # $9
            )

            # Return directly using Response to bypass FastAPI JSON re-encoding
            return Response(
                content=json_str or "[]",
                media_type="application/json"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get(
    "/api/v1/doctors/{doctor_id}", 
    tags=["Doctors"],
    summary="Fetch full doctor profile with practicing facilities"
)
async def get_doctor_profile(doctor_id: UUID):
    """
    Fetches full profile for a doctor using their UUID directly via Raw SQL.
    Joins `doctor`, `doctor_facility`, and `facility` tables natively.
    """
    if not pool:
        raise HTTPException(status_code=500, detail="Database pool is not initialized")

    query = """
    SELECT json_build_object(
        'doctor_id', d.id,
        'name', d.name,
        'gender', d.gender,
        'photo', d.photo,
        'bio', d.bio,
        'languages', d.languages,
        'specialties', d.specialties,
        'qualifications', d.qualifications,
        'experience_years', d.experience_years,
        'verification_status', d.verification_status,
        'registration', json_build_object(
            'number', d.registration_number,
            'council', d.council
        ),
        'facilities', COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'facility_id', f.id,
                        'facility_name', f.name,
                        'facility_type', f.type,
                        'address', f.address,
                        'timezone', f.timezone,
                        'department', df.department,
                        'fee', df.fee,
                        'modes', df.modes,
                        'coordinates', json_build_object(
                            'lat', ST_Y(f.location::geometry),
                            'lng', ST_X(f.location::geometry)
                        )
                    )
                )
                FROM doctor_facility df
                JOIN facility f ON df.facility_id = f.id
                WHERE df.doctor_id = d.id 
                  AND df.active = TRUE 
                  AND f.status = 'ACTIVE'
            ),
            '[]'::json
        )
    )::text
    FROM doctor d
    WHERE d.id = $1::uuid;
    """

    try:
        async with pool.acquire() as connection:
            # fetchval gets the raw JSON string created by PostgreSQL
            json_str = await connection.fetchval(query, doctor_id)

            # Handles non-existent Doctor UUIDs
            if not json_str or json_str == "null":
                raise HTTPException(
                    status_code=404, 
                    detail=f"Doctor with ID '{doctor_id}' not found"
                )

            # Streams raw JSON directly (zero re-serialization overhead)
            return Response(
                content=json_str,
                media_type="application/json"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile for doctor {doctor_id}: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Database execution error: {str(e)}"
        )