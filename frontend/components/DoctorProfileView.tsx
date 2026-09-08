'use client';

import React from 'react';
import { DoctorProfile } from '@/types/api';
import {
  ShieldCheck,
  Award,
  Globe,
  Building2,
  MapPin,
  Calendar,
  Video,
  UserCheck,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface DoctorProfileViewProps {
  doctor: DoctorProfile;
}

export default function DoctorProfileView({ doctor }: DoctorProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Primary Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <img
            src={doctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
            alt={doctor.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
              {doctor.verification_status === 'VERIFIED' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> ABDM Verified Practitioner
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-blue-700">{doctor.specialties.join(' • ')}</p>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-slate-400" /> {doctor.qualifications.join(', ')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" /> {doctor.experience_years} Years Experience
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-slate-400" /> {doctor.languages.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* ABDM & Council Registration Metadata */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Medical Registration Number
            </span>
            <span className="text-sm font-semibold text-slate-800">{doctor.registration.number}</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Medical Council
            </span>
            <span className="text-sm font-semibold text-slate-800">{doctor.registration.council}</span>
          </div>
        </div>
      </div>

      {/* About Section */}
      {doctor.bio && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> About & Clinical Expertise
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">{doctor.bio}</p>
        </div>
      )}

      {/* Practice Locations & Facilities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" /> Practice Facilities & Consultation
        </h2>

        <div className="space-y-4">
          {doctor.facilities.map((fac) => (
            <div
              key={fac.facility_id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {fac.facility_type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{fac.facility_name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{fac.department}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Consultation Fee</span>
                  <span className="text-lg font-bold text-slate-900">₹{fac.fee}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{fac.address}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  {fac.modes.includes('IN_CLINIC') && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" /> In-Clinic
                    </span>
                  )}
                  {fac.modes.includes('TELECONSULTATION') && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700">
                      <Video className="w-3.5 h-3.5 text-blue-600" /> Teleconsultation
                    </span>
                  )}
                </div>

                <a
                  href={`https://maps.google.com/?q=${fac.coordinates.lat},${fac.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View on Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}