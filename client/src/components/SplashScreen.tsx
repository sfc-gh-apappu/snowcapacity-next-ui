'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-[9999] overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* ── Background ── */}
            <div className="absolute inset-0 bg-black" />

            {/* ── Reveal glow ── */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 35% 30% at 50% 45%, rgba(41,181,232,0.12) 0%, transparent 65%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />

            {/* ── Logo + text ── */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: 300, height: 230 }}>
                {/* Logo */}
                <motion.div
                  className="absolute left-1/2 top-0 -translate-x-1/2"
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src="/snowflake-logo.png"
                    alt="Snowflake"
                    width={88}
                    height={88}
                    className="w-[88px] h-[88px]"
                    priority
                  />
                </motion.div>

                {/* Title */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
                  style={{ top: 110 }}
                >
                  <motion.div
                    className="flex items-center whitespace-nowrap"
                    initial={{ y: '120%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.25, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-4xl font-bold text-white tracking-tight">
                      Snow
                    </span>
                    <span className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#29B5E8] to-[#56C9F5] bg-clip-text text-transparent">
                      Capacity
                    </span>
                  </motion.div>
                </div>

                {/* Separator */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 h-px"
                  style={{
                    top: 160,
                    background:
                      'linear-gradient(90deg, transparent, rgba(41,181,232,0.4), transparent)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: 260 }}
                  transition={{ duration: 0.25, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
                />

                {/* Subtitle */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
                  style={{ top: 180 }}
                >
                  <motion.p
                    className="text-xs text-gray-300 tracking-[0.25em] uppercase font-medium whitespace-nowrap"
                    initial={{ y: '120%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Management Portal
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 0 : 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {children}
      </motion.div>
    </>
  );
}
