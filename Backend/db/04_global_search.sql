SELECT 
    d.id AS doctor_id,
    d.name,
    d.photo,
    d.specialties,
    d.experience_years,
    d.verification_status,
    f.id AS facility_id,
    f.name AS facility_name,
    f.address,
    df.fee,
    df.modes,
    ROUND((ST_Distance(f.location, ST_MakePoint(77.2845, 28.5355)::geography) / 1000)::numeric, 2) AS distance_km
FROM doctor_facility df
JOIN doctor d ON df.doctor_id = d.id
JOIN facility f ON df.facility_id = f.id
WHERE df.active = TRUE
  AND f.status = 'ACTIVE'
  -- 1. Spatial Filter: Distance within target radius (e.g., 10,000 meters)
  AND ST_DWithin(f.location, ST_MakePoint(77.2845, 28.5355)::geography, 10000)
  -- 2. GIN Array Filters
  AND d.specialties @> ARRAY['Cardiology'] -- e.g., ARRAY['Cardiology']
  AND d.languages @> ARRAY['Hindi']     -- e.g., ARRAY['Hindi']
  AND df.modes @> ARRAY['IN_CLINIC']     -- e.g., ARRAY['IN_CLINIC']
  -- 3. Standard B-Tree Filters
  AND df.fee <= 2000.00
ORDER BY distance_km ASC
LIMIT :limit OFFSET 10;