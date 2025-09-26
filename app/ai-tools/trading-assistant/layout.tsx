import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Trading Assistant | Forex Broker Ratings",
  description: "Get personalized trading insights and recommendations powered by AI. Analyze markets, manage risk, and improve your decision-making.",
  metadataBase: new URL('https://forexbrokeratings.com'),
  alternates: {
    canonical: 'https://forexbrokeratings.com/ai-tools/trading-assistant',
    languages: {
      'en': 'https://forexbrokeratings.com/ai-tools/trading-assistant',
      'zh': 'https://forexbrokeratings.com/zh/ai-tools/trading-assistant'
    }
  },
  openGraph: {
    type: 'website',
    url: 'https://forexbrokeratings.com/ai-tools/trading-assistant',
    title: 'AI Trading Assistant | Forex Broker Ratings',
    description: 'Get personalized trading insights and recommendations powered by AI. Analyze markets, manage risk, and improve your decision-making.',
    images: ['https://forexbrokeratings.com/assets/images/ai-tools-default.jpg'],
    siteName: 'Forex Broker Ratings',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trading Assistant | Forex Broker Ratings',
    description: 'Get personalized trading insights and recommendations powered by AI.',
    images: ['https://forexbrokeratings.com/assets/images/ai-tools-default.jpg'],
  },
};

export default function TradingAssistantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center p-0 m-0">
      {children}
    </div>
  );
}
