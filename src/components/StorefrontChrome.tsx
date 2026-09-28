"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

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
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
