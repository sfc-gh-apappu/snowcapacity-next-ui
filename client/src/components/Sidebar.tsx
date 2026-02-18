'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, FileText, Database, Calendar, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useSidebar } from '@/app/layout';
import Image from 'next/image';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Capacity Overview', href: '/capacity-overview', icon: BarChart3 },
  { name: 'Request', href: '/request', icon: FileText },
  { name: 'Quota', href: '/quota', icon: Database },
  { name: 'Reservation', href: '/reservation', icon: Calendar },
  { name: 'Admin', href: '/admin', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-black border-r border-[#1a1a1a] flex flex-col shadow-2xl transition-all duration-300 z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo/Brand with Snowflake */}
      <div className="p-6 border-b border-[#1a1a1a] relative overflow-visible">
        {!isCollapsed && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#29B5E8] opacity-5 blur-3xl rounded-full pointer-events-none"></div>
        )}
        
        <div className="relative flex items-center justify-center">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 mb-2 w-full">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  <Image 
                    src="/snowflake-logo.png" 
                    alt="Snowflake Logo" 
                    width={28} 
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
                <h1 className="text-lg font-bold tracking-tight">
                  <span className="text-white">Snow</span>
                  <span className="bg-gradient-to-r from-[#29B5E8] to-[#56C9F5] bg-clip-text text-transparent">Capacity</span>
                </h1>
              </div>
              
              {/* Toggle Button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg bg-[#0a0a0a] hover:bg-[#1a1a1a] text-gray-400 hover:text-[#29B5E8] transition-all duration-300 border border-[#1a1a1a] hover:border-[#29B5E8]/30 flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Toggle Button - Collapsed State */
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg bg-[#0a0a0a] hover:bg-[#1a1a1a] text-gray-400 hover:text-[#29B5E8] transition-all duration-300 border border-[#1a1a1a] hover:border-[#29B5E8]/30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {!isCollapsed && (
          <p className="text-gray-500 text-xs mt-1 font-medium">MANAGEMENT PORTAL</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <div key={item.href} className="relative group/tooltip">
              <Link
                href={item.href}
                className={`
                  group flex items-center gap-3 px-4 py-2 rounded-xl relative overflow-hidden
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[#0a0a0a] transition-all duration-300'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] rounded-xl shadow-lg shadow-[#29B5E8]/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                {!isCollapsed && <span className="text-sm font-medium relative z-10">{item.name}</span>}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
              
              {/* Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1a1a] text-white text-xs font-medium rounded-md border border-[#29B5E8]/30 shadow-lg shadow-[#29B5E8]/20 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-[100]">
                  {item.name}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-[#1a1a1a]"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="text-xs text-gray-600 text-center font-mono">
            v1.0.0 • <span className="text-[#29B5E8]">LIVE</span>
          </div>
        </div>
      )}
    </aside>
  );
}
