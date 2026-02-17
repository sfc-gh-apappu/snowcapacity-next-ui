'use client';

import React from 'react';

interface DashCardProps {
  title: string;
  subtitle?: string;
  accentColor: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function DashCard({ title, subtitle, accentColor, icon, children, className = '' }: DashCardProps) {
  return (
    <div className={`relative group rounded-2xl bg-[#0a0a0c] border border-[#141414] overflow-hidden h-full hover:border-[#222] transition-all duration-300 ${className}`}>
      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40, transparent)` }} />

      <div className="p-5 h-[calc(100%-2px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          {icon && (
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wide">{title}</h3>
            {subtitle && <p className="text-[10px] text-gray-600 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>

      {/* Hover corner glow */}
      <div
        className="absolute -top-14 -right-14 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: `${accentColor}06` }}
      />
    </div>
  );
}
