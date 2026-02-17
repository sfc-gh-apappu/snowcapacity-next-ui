'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Wrench, ArrowRightLeft, MoveRight, Scissors, Share2, ShieldOff, XCircle } from 'lucide-react';

const ACTIONS = [
  { key: 'modify', label: 'Modify', icon: Wrench },
  { key: 'move', label: 'Move', icon: MoveRight },
  { key: 'split', label: 'Split', icon: Scissors },
  { key: 'share', label: 'Share', icon: Share2 },
  { key: 'unshare', label: 'Unshare', icon: ShieldOff },
  { key: 'cancel', label: 'Cancel', icon: XCircle },
] as const;

interface Props {
  onAction: (action: string) => void;
}

export default function ActionsDropdown({ onAction }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-gray-500 hover:text-white transition-all"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="py-1">
            {ACTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={(e) => { e.stopPropagation(); setOpen(false); onAction(key); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  key === 'cancel'
                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Under-Development Dialog ─── */

export function ActionUnavailableModal({
  action,
  onClose,
}: {
  action: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!action) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [action, onClose]);

  if (!action) return null;

  const label = action.charAt(0).toUpperCase() + action.slice(1);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 to-transparent" />
        <div className="flex flex-col items-center py-10 px-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-[#29B5E8]/10 border border-violet-500/20 mb-5">
            <ArrowRightLeft className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{label}</h3>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            The <span className="text-gray-300 font-medium">{label}</span> action is currently under development. Check back soon for updates.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-sm text-white font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
