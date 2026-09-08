'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const AVAILABLE_LANGUAGES = ['English', 'Hindi', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Marathi'];
const CONSULTATION_MODES = [
  { label: 'In-Clinic', value: 'IN_CLINIC' },
  { label: 'Teleconsultation', value: 'TELECONSULTATION' },
];

interface FilterBarProps {
  maxFee: number;
  onMaxFeeChange: (fee: number) => void;
  selectedModes: string[];
  onModesChange: (modes: string[]) => void;
  selectedLanguages: string[];
  onLanguagesChange: (langs: string[]) => void;
  onReset: () => void;
}

export default function FilterBar({
  maxFee,
  onMaxFeeChange,
  selectedModes,
  onModesChange,
  selectedLanguages,
  onLanguagesChange,
  onReset,
}: FilterBarProps) {
  const toggleMode = (mode: string) => {
    if (selectedModes.includes(mode)) {
      onModesChange(selectedModes.filter((m) => m !== mode));
    } else {
      onModesChange([...selectedModes, mode]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      onLanguagesChange(selectedLanguages.filter((l) => l !== lang));
    } else {
      onLanguagesChange([...selectedLanguages, lang]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filter Results</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" /> Reset All
        </button>
      </div>

      {/* Max Consultation Fee */}
      <div>
        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
          <span>Max Fee</span>
          <span className="text-blue-600 font-bold">₹{maxFee}</span>
        </div>
        <input
          type="range"
          min={200}
          max={3000}
          step={100}
          value={maxFee}
          onChange={(e) => onMaxFeeChange(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹200</span>
          <span>₹3,000+</span>
        </div>
      </div>

      {/* Consultation Mode */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-2">
          Consultation Mode
        </label>
        <div className="flex flex-wrap gap-2">
          {CONSULTATION_MODES.map((mode) => {
            const isSelected = selectedModes.includes(mode.value);
            return (
              <button
                key={mode.value}
                onClick={() => toggleMode(mode.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages Spoken */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-2">
          Languages
        </label>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguages.includes(lang);
            return (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}