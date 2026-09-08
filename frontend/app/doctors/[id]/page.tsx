import React from 'react';
import Link from 'next/link';
import { fetchDoctorProfile } from '@/lib/api';
import DoctorProfileView from '@/components/DoctorProfileView';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const doctorId = params.id;

  try {
    const doctor = await fetchDoctorProfile(doctorId);

    return (
      <div className="space-y-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctor Search
          </Link>
        </div>

        <DoctorProfileView doctor={doctor} />
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Doctor Profile Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested medical practitioner profile could not be retrieved from the ABDM repository.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Return to Home Search
        </Link>
      </div>
    );
  }
}