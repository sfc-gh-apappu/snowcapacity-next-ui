'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function CountUp({
  end,
  duration = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState('0');
  const prevEnd = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const start = prevEnd.current;
    prevEnd.current = end;

    if (start === end) {
      setDisplay(end.toFixed(decimals));
      return;
    }

    const startTime = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    cancelAnimationFrame(rafId.current);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = start + (end - start) * easeOut(progress);
      setDisplay(value.toFixed(decimals));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      }
    };

    rafId.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId.current);
  }, [end, duration, decimals]);

  return (
    <span className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
