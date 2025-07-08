"use client";
import React, {useState, useEffect} from "react";
import { useSearchParams } from 'next/navigation';
import AiToolsPanel from "@/components/ai-tools/AiToolsPanel";
import { useLoginModal } from '@/components/broker/LoginModalContext';
import LoginModal from '@/components/ui/LoginModal';
import { LoginModalProvider } from '@/components/broker/LoginModalContext';

export default function TradingAssistantPage() {
  return (
    <LoginModalProvider>
      <TradingAssistantPageContent />
    </LoginModalProvider>
  );
}

function TradingAssistantPageContent() {
  const { open, setOpen } = useLoginModal();
  const [pre_prompt, setPrePrompt] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const prompt = searchParams?.get('prompt');
    if (prompt) {
      setPrePrompt(prompt);
    }
  }, [searchParams]);
  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center p-0 m-0">
      <div className="w-full max-w-6xl mx-auto">
        <AiToolsPanel setOpen={setOpen} pre_prompt={pre_prompt} />
        <LoginModal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}

