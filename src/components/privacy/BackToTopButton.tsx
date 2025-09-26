"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n-client';

export default function BackToTopButton() {
  const { t } = useI18n();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 px-5 py-2 rounded-full bg-[#0b1e3c] text-white shadow-lg transition-opacity"
      aria-label={t('privacy.back_to_top')}
    >
      ↑ {t('privacy.back_to_top')}
    </button>
  ) : null;
}
