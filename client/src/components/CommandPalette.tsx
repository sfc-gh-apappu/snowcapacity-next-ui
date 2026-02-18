'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Home, BarChart3, FileText, Database, Calendar, Shield, Search, Command } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const pages = [
  { name: 'Home', href: '/', icon: Home, keywords: 'home dashboard overview' },
  { name: 'Capacity Overview', href: '/capacity-overview', icon: BarChart3, keywords: 'capacity demand forecast graph' },
  { name: 'Request', href: '/request', icon: FileText, keywords: 'request create new submit' },
  { name: 'Quota', href: '/quota', icon: Database, keywords: 'quota usage adjustments azure' },
  { name: 'Reservation', href: '/reservation', icon: Calendar, keywords: 'reservation detail aws odcr' },
  { name: 'Admin', href: '/admin', icon: Shield, keywords: 'admin configuration constrained' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return pages;
    const q = query.toLowerCase();
    return pages.filter(
      (p) => p.name.toLowerCase().includes(q) || p.keywords.includes(q)
    );
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[active]) {
      navigate(results[active].href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] shadow-2xl shadow-[#29B5E8]/5 overflow-hidden"
            initial={{ y: -20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-[#1a1a1a]">
              <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent py-4 text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[10px] text-gray-500 font-mono border border-[#2a2a2a]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto py-2 px-2">
              {results.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">No results found</p>
              )}
              {results.map((page, idx) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.href}
                    onClick={() => navigate(page.href)}
                    onMouseEnter={() => setActive(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      active === idx
                        ? 'bg-[#29B5E8]/10 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${active === idx ? 'bg-[#29B5E8]/20 text-[#29B5E8]' : 'bg-[#1a1a1a]'} transition-colors`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{page.name}</span>
                    {active === idx && (
                      <span className="ml-auto text-[10px] text-gray-500 font-mono">Enter</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#1a1a1a] text-[10px] text-gray-600">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] font-mono">↵</kbd>
                Open
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <Command className="w-3 h-3" />
                <span>K to toggle</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
