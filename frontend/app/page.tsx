'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import DoctorCard from '@/components/DoctorCard';
import { fetchDoctors } from '@/lib/api';
import { DoctorSearchResult, SearchParams } from '@/types/api';
import { Loader2, AlertCircle, SearchX } from 'lucide-react';

const DEFAULT_LAT = 28.5355;
const DEFAULT_LNG = 77.2845;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [maxFee, setMaxFee] = useState<number>(2000);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const [doctors, setDoctors] = useState<DoctorSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: SearchParams = {
      lat,
      lng,
      radius_km: 50,
      specialties: query.trim() || undefined,
      max_fee: maxFee,
      modes: selectedModes.length > 0 ? selectedModes : undefined,
      languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
      limit: 20,
    };

    try {
      const data = await fetchDoctors(params);
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search doctors');
    } finally {
      setLoading(false);
    }
  }, [query, lat, lng, maxFee, selectedModes, selectedLanguages]);

  // Debounced execution for search query and filters
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDoctors();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadDoctors]);

  const handleResetFilters = () => {
    setMaxFee(2000);
    setSelectedModes([]);
    setSelectedLanguages([]);
    setQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        lat={lat}
        lng={lng}
        onLocationUpdate={(newLat, newLng) => {
          setLat(newLat);
          setLng(newLng);
        }}
      />

      {/* Main Grid: Sidebar Filters + Doctor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <FilterBar
            maxFee={maxFee}
            onMaxFeeChange={setMaxFee}
            selectedModes={selectedModes}
            onModesChange={setSelectedModes}
            selectedLanguages={selectedLanguages}
            onLanguagesChange={setSelectedLanguages}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Results Container */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Showing {doctors.length} doctor{doctors.length === 1 ? '' : 's'} near your location
            </span>
            {loading && (
              <span className="flex items-center gap-1 text-blue-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
              </span>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && doctors.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <SearchX className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 text-base">No doctors found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, increasing max consultation fee, or clearing active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline pt-2"
              >
                Reset All Filters
              </button>
            </div>
          )}

           {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doctor, index) => (
              <DoctorCard
                key={`${doctor.doctor_id}-${doctor.facility_id || index}`}
                doctor={doctor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}