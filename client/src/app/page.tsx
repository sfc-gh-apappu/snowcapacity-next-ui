'use client';

import QuotaSummary from './home/QuotaSummary';
import ReservationsSummary from './home/ReservationsSummary';
import RequestsSummary from './home/RequestsSummary';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Multi-layer glow */}
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#29B5E8] opacity-[0.08] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-40 w-72 h-72 bg-violet-500 opacity-[0.06] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute top-10 -left-20 w-60 h-60 bg-emerald-500 opacity-[0.04] blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
              Snowflake Capacity Platform
            </span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl">
            Welcome to SnowCap &mdash; your central platform for managing Snowflake capacity resources, quotas, and reservations.
          </p>
        </div>
      </div>

      {/* Sections */}
      <QuotaSummary />

      <div className="h-px bg-gradient-to-r from-transparent via-[#29B5E8]/20 to-transparent" />

      <ReservationsSummary />

      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

      <RequestsSummary />
    </div>
  );
}
