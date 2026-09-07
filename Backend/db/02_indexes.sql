-- PostGIS Spatial Index for Location Radius Search
CREATE INDEX idx_facility_location ON facility USING gist (location);


CREATE INDEX ix_doctors_full_name_trgm  ON doctor  USING gin (lower(name) gin_trgm_ops);
CREATE INDEX ix_facility_name_trgm       ON facility USING gin (lower(name) gin_trgm_ops);



CREATE OR REPLACE FUNCTION array_to_string_immutable(arr text[])
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
    SELECT array_to_string(arr, ' ');
$$;

-- 3. Create the GIN Trigram index on doctor specialties
CREATE INDEX IF NOT EXISTS idx_doctor_specialties_trgm 
ON doctor 
USING gin (array_to_string_immutable(specialties) gin_trgm_ops);
-- doctor discovery array filters

CREATE INDEX ix_doctors_specialties_gin     ON doctor USING gin (specialties);
CREATE INDEX ix_doctors_languages_gin       ON doctor USING gin (languages);
CREATE INDEX ix_doctor_facilities_modes_gin ON doctor_facility USING gin (modes);