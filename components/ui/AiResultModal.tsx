"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, Send } from "lucide-react";
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { useI18n } from "@/lib/i18n-client";
interface AiResultModalProps {
  open: boolean;
  result: string;
  onClose: () => void;
  getAiResult: boolean;
}

export default function AiResultModal({ open, result, onClose, getAiResult }: AiResultModalProps) {
  const [displayed, setDisplayed] = React.useState('');
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const { t } = useI18n();
  
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
  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert(t('ai_result.copied'));
    } catch {
      alert(t('ai_result.copy_failed'));
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
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full relative p-6">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label={t('ai_result.close_aria')}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">{t('ai_result.title')}</h2>
        <div className="max-h-80 overflow-y-auto whitespace-pre-line text-gray-800 border rounded p-3 bg-gray-50 mb-4 font-mono">
          {getAiResult ? displayed : t('ai_result.analysing')}
        </div>
        <div className="flex gap-3 justify-end">
          <Button size="sm" variant="outline" onClick={handleCopy} title={t('ai_result.copy')}>
            <Copy className="w-4 h-4 mr-1" /> {t('ai_result.copy')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShareWhatsApp} title={t('ai_result.share_whatsapp')}>
            <FaWhatsapp className="w-4 h-4 mr-1" /> {t('ai_result.whatsapp')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShareTelegram} title={t('ai_result.share_telegram')}>
            <FaTelegram className="w-4 h-4 mr-1" /> {t('ai_result.telegram')}
          </Button>
        </div>
      </div>
    </div>
  );
}
