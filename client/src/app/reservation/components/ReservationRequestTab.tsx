'use client';

import { Wrench } from 'lucide-react';

export default function ReservationRequestTab() {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#29B5E8]/10 to-violet-500/10 border border-[#29B5E8]/20 mb-6">
          <Wrench className="w-10 h-10 text-[#29B5E8]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Under Development</h3>
        <p className="text-gray-500 text-sm text-center max-w-md">
          The Reservation Request view is currently being built. Check back soon for the ability to submit and track reservation requests.
        </p>
      </div>
    </div>
  );
}
