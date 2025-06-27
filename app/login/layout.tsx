import type { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen max-w-3xl mx-auto flex items-center justify-center">
      {children}
    </div>
  );
}
