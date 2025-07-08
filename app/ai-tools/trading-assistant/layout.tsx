import type { ReactNode } from "react";

export default function TradingAssistantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center p-0 m-0">
      {children}
    </div>
  );
}
