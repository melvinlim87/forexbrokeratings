import React from "react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4 md:px-10">
        {children}
      </main>
    </div>
  );
}
