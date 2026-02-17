'use client';

import QuotaSummary from './home/QuotaSummary';
import ReservationsSummary from './home/ReservationsSummary';
import RequestsSummary from './home/RequestsSummary';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Snowflake Capacity Platform
          </span>
        </h1>
        <p className="text-gray-400 mt-3 text-lg max-w-2xl">
          Welcome to SnowCap &mdash; your central platform for managing Snowflake capacity resources, quotas, and reservations.
        </p>
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
