'use client';

import React, { useState } from 'react';
import { Search, MapPin, Navigation, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  lat?: number;
  lng?: number;
  onLocationUpdate: (lat: number, lng: number) => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  lat,
  lng,
  onLocationUpdate,
}: SearchBarProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState<string>('New Delhi (Default)');

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationUpdate(latitude, longitude);
        setLocationName(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to fetch location. Reverting to default (New Delhi).');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 p-2 sm:p-3">
      <div className="flex flex-col md:flex-row items-center gap-2">
        {/* Search Query Input */}
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search doctors, specialties (e.g. Neuro, Cardio, Ortho)..."
            className="w-full pl-11 pr-9 py-2.5 text-sm sm:text-base rounded-lg border border-transparent focus:border-blue-500 focus:bg-slate-50 focus:outline-none transition"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Location Selector / GPS Button */}
        <div className="w-full md:w-auto flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="truncate font-medium">{locationName}</span>
          </div>

          <button
            onClick={handleGeolocation}
            disabled={isLocating}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition disabled:opacity-50"
            title="Use My Exact Location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 fill-current" />
            )}
            <span>GPS</span>
          </button>
        </div>
      </div>
    </div>
  );
}