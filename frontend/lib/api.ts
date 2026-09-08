import { DoctorProfile, DoctorSearchResult, SearchParams } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://doctor-global-search-backend-git-main-personal-5050.vercel.app';

export async function fetchDoctors(params: SearchParams): Promise<DoctorSearchResult[]> {
  const query = new URLSearchParams();

  if (params.lat !== undefined) query.append('lat', params.lat.toString());
  if (params.lng !== undefined) query.append('lng', params.lng.toString());
  if (params.radius_km !== undefined) query.append('radius_km', params.radius_km.toString());
  if (params.specialties) query.append('q', params.specialties);
  if (params.max_fee) query.append('max_fee', params.max_fee.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.offset) query.append('offset', params.offset.toString());

  if (params.languages) {
    params.languages.forEach((lang) => query.append('languages', lang));
  }
  if (params.modes) {
    params.modes.forEach((mode) => query.append('modes', mode));
  }

  const res = await fetch(`${BASE_URL}/api/v1/search/doctors?${query.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch doctors: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchDoctorProfile(doctorId: string): Promise<DoctorProfile> {
  const res = await fetch(`${BASE_URL}/api/v1/doctors/${doctorId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch doctor profile: ${res.statusText}`);
  }

  return res.json();
}