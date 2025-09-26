"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GaListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Send a page_view/config event to GA4 on route changes
    // Ensures gtag snippet in layout has run (window.gtag exists)
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
