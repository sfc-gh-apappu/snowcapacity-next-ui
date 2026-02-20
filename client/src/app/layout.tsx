'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import SplashScreen from "@/components/SplashScreen";
import QueryProvider from "@/lib/queryClient";
import { useState, useEffect, createContext, useContext } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SidebarContext = createContext({ isCollapsed: false, setIsCollapsed: (value: boolean) => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setIsCollapsed(true);
    };
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>SnowCapacity</title>
        <meta name="description" content="Snowflake Capacity Management Platform" />
        <link rel="icon" href="/snowflake-logo.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <SplashScreen>
              <div className="flex min-h-screen bg-black">
                <Sidebar />
                <main className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-black via-[#0a0a0a] to-black transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                  {children}
                </main>
                <CommandPalette />
              </div>
            </SplashScreen>
          </SidebarContext.Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
