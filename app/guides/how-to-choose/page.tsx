import HowToChoose from '@/components/home/how-to-choose';
import { HowToSchema } from '@/components/seo/structured-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Choose a Forex Broker in 2026 | 5-Step Guide',
  description: 'Learn how to choose a forex broker with our 5-step framework used by professional traders. Covers regulation, fees, platforms, instruments, and support.',
  alternates: { canonical: '/guides/how-to-choose' },
};

export default function HowToChooseGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HowToSchema />
      <HowToChoose />
    </div>
  );
}
