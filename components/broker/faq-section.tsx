"use client";

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  brokerName: string;
  faqs: FAQ[];
}

export function FAQSection({ brokerName, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
        {/* Compact Header */}
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-4 w-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">FAQ</h3>
        </div>

        <div className="space-y-1">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-700/30 rounded overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-left hover:bg-gray-800/20 transition-colors"
              >
                <span className="text-base font-medium text-white pr-2">{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-2 pb-2">
                  <p className="text-[11px] text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
