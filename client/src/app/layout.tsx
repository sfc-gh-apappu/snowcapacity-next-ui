'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { useState, createContext, useContext } from "react";

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
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
          <div className="flex min-h-screen bg-black">
            <Sidebar />
            <main className={`flex-1 p-8 bg-gradient-to-br from-black via-[#0a0a0a] to-black transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
              {children}
            </main>
          </div>
        </SidebarContext.Provider>
      </body>
    </html>
  );
}
