"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { FlickeringGrid } from "./FlickeringGrid";

export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAdminHost, setIsAdminHost] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.startsWith("admin.") || host.includes("admin.localhost")) {
        setIsAdminHost(true);
      }
    }
  }, []);

  const isAdmin = isAdminHost || (pathname && pathname.startsWith("/admin"));

  if (isAdmin) {
    return <main className="flex-1 min-h-screen bg-[#0D0E11] text-neutral-100">{children}</main>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--theme-canvas)] text-[var(--theme-ink)] overflow-x-clip">
      {/* Universal Fixed Background Flickering Grid for all sections */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          color="rgb(15, 23, 42)"
          maxOpacity={0.08}
          flickerChance={0.2}
          className="w-full h-full opacity-60"
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
