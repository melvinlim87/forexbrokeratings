"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, Send } from "lucide-react";
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

interface AiResultModalProps {
  open: boolean;
  result: string;
  onClose: () => void;
  getAiResult: boolean;
}

export default function AiResultModal({ open, result, onClose, getAiResult }: AiResultModalProps) {
  const [displayed, setDisplayed] = React.useState('');
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const displayedRef = React.useRef<HTMLTextAreaElement>(null);
  const [displayedHeight, setDisplayedHeight] = React.useState<string | number>('auto');
  
  React.useEffect(() => {
    if (!open) {
      setDisplayed('');
      return;
    }
    setDisplayed('');
    if (!result) return;
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(result.slice(0, i));
      if (i >= result.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 12);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open, result]);

  React.useEffect(() => {
    if (displayedRef.current) {
      displayedRef.current.style.height = 'auto';
      const newHeight = Math.min(displayedRef.current.scrollHeight, 320);
      displayedRef.current.style.height = newHeight + 'px';
      setDisplayedHeight(newHeight);
    }
  }, [displayed]);
  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy.");
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(result)}`;
    window.open(url, "_blank");
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=&text=${encodeURIComponent(result)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-5xl w-full relative p-6">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">AI Broker Analysis</h2>
        <textarea
          readOnly
          ref={displayedRef}
          value={getAiResult ? displayed : "Analysing..."}
          className="w-full border rounded p-3 bg-gray-50 dark:bg-gray-800 mb-4 font-mono text-gray-800 dark:text-gray-100 whitespace-pre-line resize-none focus:outline-none"
          style={{ height: displayedHeight, maxHeight: 320, overflowY: 'auto' }}
        />
        <div className="flex gap-3 justify-end">
          <Button size="sm" variant="outline" onClick={handleCopy} title="Copy">
            <Copy className="w-4 h-4 mr-1" /> Copy
          </Button>
          <Button size="sm" variant="outline" onClick={handleShareWhatsApp} title="Share to WhatsApp">
            <FaWhatsapp className="w-4 h-4 mr-1" /> WhatsApp
          </Button>
          <Button size="sm" variant="outline" onClick={handleShareTelegram} title="Share to Telegram">
            <FaTelegram className="w-4 h-4 mr-1" /> Telegram
          </Button>
        </div>
      </div>
    </div>
  );
}
