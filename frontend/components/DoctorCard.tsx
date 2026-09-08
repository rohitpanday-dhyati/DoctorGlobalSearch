'use client';

import React from 'react';
import Link from 'next/link';
import { DoctorSearchResult } from '@/types/api';
import { ShieldCheck, MapPin, Video, UserCheck, Stethoscope, ChevronRight } from 'lucide-react';

interface DoctorCardProps {
  doctor: DoctorSearchResult;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
      <div>
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={doctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
              alt={doctor.doctor_name}
              className="w-16 h-16 rounded-full object-cover border border-slate-200 bg-slate-100"
            />
            {doctor.verification_status === 'VERIFIED' && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow" title="ABDM Verified Doctor">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-base truncate">{doctor.doctor_name}</h3>
              {doctor.verification_status === 'VERIFIED' && (
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  ABDM Verified
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="truncate">{doctor.specialties.join(', ')}</span>
            </p>

            <p className="text-xs text-slate-600 mt-1">
              <strong className="font-medium text-slate-800">{doctor.experience_years}+ Years</strong> Experience
            </p>
          </div>
        </div>

        {/* Facility Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="font-medium text-slate-800 truncate">{doctor.facility_name}</div>
          <div className="flex items-start gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{doctor.address}</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Consultation Fee</span>
            <span className="text-sm font-bold text-slate-900">₹{doctor.fee}</span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Distance</span>
            <span className="text-xs font-semibold text-blue-600">{doctor.distance_km.toFixed(1)} km away</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {doctor.modes.includes('TELECONSULTATION') && (
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Teleconsultation Available">
              <Video className="w-4 h-4" />
            </span>
          )}
          {doctor.modes.includes('IN_CLINIC') && (
            <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg" title="In-Clinic Visit Available">
              <UserCheck className="w-4 h-4" />
            </span>
          )}

          <Link
            href={`/doctors/${doctor.doctor_id}`}
            className="flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
          >
            Profile <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}