"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface LoginModalContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextProps | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <LoginModalContext.Provider value={{ open, setOpen }}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) throw new Error('useLoginModal must be used within a LoginModalProvider');
  return context;
}
