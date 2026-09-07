-- 1. Insert Facilities (Delhi NCR Coordinates)
INSERT INTO facility (id, name, type, address, location, timezone, status) VALUES
('f1111111-1111-1111-1111-111111111111', 'Apollo Hospital', 'HOSPITAL', 'Sarita Vihar, Delhi', ST_SetSRID(ST_MakePoint(77.2845, 28.5355), 4326), 'Asia/Kolkata', 'ACTIVE'),
('f2222222-2222-2222-2222-222222222222', 'Max Super Speciality', 'HOSPITAL', 'Saket, New Delhi', ST_SetSRID(ST_MakePoint(77.2120, 28.5273), 4326), 'Asia/Kolkata', 'ACTIVE'),
('f3333333-3333-3333-3333-333333333333', 'City Heart Clinic', 'SOLO_CLINIC', 'Connaught Place, Delhi', ST_SetSRID(ST_MakePoint(77.2177, 28.6304), 4326), 'Asia/Kolkata', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Doctors (With ABDM Registration Credentials)
INSERT INTO doctor (id, name, gender, languages, specialties, qualifications, registration_number, council, experience_years, verification_status) VALUES
('d1111111-1111-1111-1111-111111111111', 'Dr. Ramesh Sharma', 'MALE', ARRAY['English', 'Hindi'], ARRAY['Cardiology', 'Internal Medicine'], ARRAY['MBBS', 'MD'], 'DMC-12345', 'Delhi Medical Council', 15, 'VERIFIED'),
('d2222222-2222-2222-2222-222222222222', 'Dr. Priya Gupta', 'FEMALE', ARRAY['English', 'Hindi', 'Punjabi'], ARRAY['Neurology'], ARRAY['MBBS', 'DM'], 'DMC-67890', 'Delhi Medical Council', 10, 'VERIFIED'),
('d3333333-3333-3333-3333-333333333333', 'Dr. Anil Verma', 'MALE', ARRAY['English', 'Hindi'], ARRAY['General Medicine', 'Cardiology'], ARRAY['MBBS', 'MD'], 'MCI-99887', 'Medical Council of India', 20, 'VERIFIED')
ON CONFLICT (id) DO NOTHING;

-- 3. Link Doctors to Practice Locations (Fees & Consultation Modes)
INSERT INTO doctor_facility (id, doctor_id, facility_id, department, fee, modes, active) VALUES
('df111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Cardiology', 1500.00, ARRAY['IN_CLINIC'], TRUE),
('df222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'f3333333-3333-3333-3333-333333333333', 'Consultation', 1000.00, ARRAY['IN_CLINIC', 'VIDEO'], TRUE),
('df333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 'Neurology', 2000.00, ARRAY['IN_CLINIC'], TRUE),
('df444444-4444-4444-4444-444444444444', 'd3333333-3333-3333-3333-333333333333', 'f1111111-1111-1111-1111-111111111111', 'Internal Medicine', 1200.00, ARRAY['IN_CLINIC', 'VIDEO'], TRUE)
ON CONFLICT (id) DO NOTHING;