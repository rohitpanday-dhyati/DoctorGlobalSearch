export interface SearchParams {
  lat?: number;
  lng?: number;
  radius_km?: number;
  specialties?: string;
  languages?: string[];
  modes?: string[];
  max_fee?: number;
  limit?: number;
  offset?: number;
}

export interface DoctorSearchResult {
  doctor_id: string;
  doctor_name: string;
  photo: string | null;
  specialties: string[];
  experience_years: number;
  verification_status: string;
  facility_id: string;
  facility_name: string;
  address: string;
  fee: number;
  modes: string[];
  distance_km: number;
}

export interface FacilityCoordinates {
  lat: number;
  lng: number;
}

export interface PracticeFacility {
  facility_id: string;
  facility_name: string;
  facility_type: string;
  address: string;
  timezone: string;
  department: string;
  fee: number;
  modes: string[];
  coordinates: FacilityCoordinates;
}

export interface DoctorProfile {
  doctor_id: string;
  name: string;
  gender: string;
  photo: string | null;
  bio: string | null;
  languages: string[];
  specialties: string[];
  qualifications: string[];
  experience_years: number;
  verification_status: string;
  registration: {
    number: string;
    council: string;
  };
  facilities: PracticeFacility[];
}