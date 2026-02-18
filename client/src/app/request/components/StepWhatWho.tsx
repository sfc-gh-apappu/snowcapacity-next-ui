'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, Users } from 'lucide-react';
import { REQUEST_TYPES, TEAMS, CLOUD_PROVIDERS } from '../constants';
import type { RequestForm } from '../constants';

interface StepWhatWhoProps {
  form: RequestForm;
  setForm: (form: RequestForm) => void;
}

export default function StepWhatWho({ form, setForm }: StepWhatWhoProps) {
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTeamDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showTeam = form.requestType === 'ONDEMAND_CREATE';

  return (
    <div className="relative z-10 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">What do you need & who&apos;s requesting?</h2>
        <p className="text-gray-400 mt-1">Select your request type{showTeam ? ', team,' : ''} and cloud provider</p>
      </div>

      {/* Request Type — card selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">Request Type</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REQUEST_TYPES.map((rt) => {
            const Icon = rt.icon;
            const isSelected = form.requestType === rt.id;
            return (
              <button
                key={rt.id}
                type="button"
                onClick={() => setForm({ ...form, requestType: rt.id, team: rt.id === 'ONDEMAND_CREATE' ? form.team : '' })}
                className={`
                  group relative text-left p-5 rounded-2xl border-2 transition-all duration-300
                  ${isSelected
                    ? `${rt.border} bg-black shadow-lg ${rt.glow}`
                    : 'border-[#1a1a1a] bg-black/50 hover:border-[#2a2a2a]'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${rt.color} flex items-center justify-center`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${rt.color} shadow-lg ${rt.glow}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{rt.label}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{rt.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Team — only for On-Demand (maps to requestor_team) */}
      {showTeam && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-400">Requestor Team</label>
          <div className="relative w-full md:w-1/2" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
              className={`
                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300
                ${teamDropdownOpen
                  ? 'bg-black border-[#29B5E8]/50 ring-2 ring-[#29B5E8]/20 shadow-lg shadow-[#29B5E8]/10'
                  : form.team
                  ? 'bg-black border-[#29B5E8]/30 text-white hover:border-[#29B5E8]/50'
                  : 'bg-black border-[#1a1a1a] text-gray-500 hover:border-[#2a2a2a]'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${form.team ? 'text-[#29B5E8]' : 'text-gray-600'}`} />
                <span className={form.team ? 'text-white' : 'text-gray-500'}>
                  {form.team || 'Select a team'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${teamDropdownOpen ? 'rotate-180 text-[#29B5E8]' : ''}`} />
            </button>

            {teamDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="py-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                  {form.team && (
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, team: '' }); setTeamDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-500 hover:bg-white/[0.04] hover:text-gray-300 transition-all duration-150 border-b border-[#1a1a1a] mb-1"
                    >
                      <span className="font-medium italic">Clear selection</span>
                    </button>
                  )}
                  {TEAMS.map((t) => {
                    const isSelected = form.team === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setForm({ ...form, team: t }); setTeamDropdownOpen(false); }}
                        className={`
                          w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-150
                          ${isSelected
                            ? 'bg-[#29B5E8]/10 text-[#29B5E8]'
                            : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                          }
                        `}
                      >
                        <span className="font-medium">{t}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cloud Provider — visual cards */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">Cloud Provider</label>
        <div className="grid grid-cols-3 gap-3">
          {CLOUD_PROVIDERS.map((cp) => {
            const isSelected = form.cloudProvider === cp.id;
            return (
              <button
                key={cp.id}
                type="button"
                onClick={() => setForm({ ...form, cloudProvider: cp.id, region: '', subscriptionId: '', accountName: '', availabilityZone: '' })}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300
                  ${isSelected
                    ? `${cp.border} bg-black shadow-lg ${cp.glow}`
                    : 'border-[#1a1a1a] bg-black/50 hover:border-[#2a2a2a]'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${cp.color} flex items-center justify-center`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <Image src={cp.logo} alt={cp.label} width={40} height={40} className="object-contain" />
                <span className="text-sm font-semibold text-white">{cp.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
