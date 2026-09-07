from fastapi import FastAPI, HTTPException, Query
from typing import Optional, List, Dict, Any
import os
from supabase import create_client, Client

app = FastAPI()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), 
    os.getenv("SUPABASE_KEY")
    
)

@app.get("/api/v1/search/doctors", response_model=List[Dict[str, Any]])
async def search_doctors(
    q: Optional[str] = Query(None),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius_km: float = Query(10.0)
):
    try:
        # Supabase RPC handles the query, PostGIS spatial search, and returns structured JSON
        response = supabase.rpc(
            "search_doctors_v1",
            {
                "search_term": q,
                "user_lat": lat,
                "user_lng": lng,
                "radius_km": radius_km
            }
        ).execute()

        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
