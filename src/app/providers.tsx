"use client";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import dynamic from "next/dynamic";

// Import Toaster with SSR disabled to avoid hydration issues
const Toaster = dynamic(() => import("@/components/ui/Toaster"), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}