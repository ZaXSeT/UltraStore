"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function StickyShopSidebar({ children }: { children: ReactNode }) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let frame = 0;
    const updateHeight = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.innerWidth < 1024) {
          sidebar.style.removeProperty("max-height");
          return;
        }

        // Before the sidebar sticks, its top is below the catalog heading.
        // Keep the scrollable area inside the visible viewport at either position.
        const visibleHeight = window.innerHeight - sidebar.getBoundingClientRect().top - 16;
        sidebar.style.maxHeight = `${Math.max(0, visibleHeight)}px`;
      });
    };

    updateHeight();
    window.addEventListener("scroll", updateHeight, { passive: true });
    window.addEventListener("resize", updateHeight);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className="w-full lg:w-64 xl:w-72 shrink-0 self-start lg:sticky lg:top-28 lg:max-h-[calc(100dvh-18rem)] lg:overflow-y-auto"
    >
      {children}
    </aside>
  );
}
