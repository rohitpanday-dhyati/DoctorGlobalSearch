-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Facility Table
CREATE TABLE facility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'SOLO_CLINIC', 'MULTI_CLINIC', 'HOSPITAL'
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL, -- WGS84 coordinates
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Doctor Table
CREATE TABLE doctor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    photo VARCHAR(512),
    languages TEXT[] NOT NULL, -- e.g., ARRAY['English', 'Hindi']
    specialties TEXT[] NOT NULL, -- e.g., ARRAY['Cardiology', 'Internal Medicine']
    qualifications TEXT[] NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    council VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'VERIFIED',
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DoctorFacility (Practice Link)
CREATE TABLE doctor_facility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctor(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES facility(id) ON DELETE CASCADE,
    department VARCHAR(100),
    fee NUMERIC(10, 2) NOT NULL,
    modes TEXT[] NOT NULL, -- ARRAY['IN_CLINIC', 'VIDEO']
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(doctor_id, facility_id)
);