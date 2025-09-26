"use client";
import React from "react";
import ContactClient from "@/components/contact/ContactClient";
import T from '@/components/common/T';
import { useI18n } from '@/lib/i18n-client';

const advisoryBullets = [
  'contact.advisory_1',
  'contact.advisory_2',
  'contact.advisory_3',
];

const responseTable = [
  ['contact.req.general', 'contact.turnaround.within_1_bd'],
  ['contact.req.errors', 'contact.turnaround.one_to_three_bd'],
  ['contact.req.privacy', 'contact.turnaround.within_30_days'],
];

export default function ContactUsPage() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12" data-privacy-page>
      {/* Hero Header */}
      <article data-section="hero" className="max-w-2xl mx-auto pt-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#11223a] mb-2"><T k="contact.title" /></h1>
        <p className="text-base md:text-lg text-cyan-700 mb-8"><T k="contact.subtitle" /></p>
      </article>

      {/* Contact Channels + Form (client) */}
      <ContactClient />

      {/* Advisory Section */}
      <article data-section="advisory" className="max-w-2xl mx-auto px-4 mt-12">
        <ul className="list-disc pl-6 text-gray-600 text-sm space-y-2">
          {advisoryBullets.map((k, i) => (
            <li key={i}><T k={k} /></li>
          ))}
        </ul>
      </article>

      {/* Response-Time Table */}
      <article data-section="response-table" className="max-w-xl mx-auto px-4 mt-10">
        <table className="w-full border-collapse text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-cyan-50">
              <th className="w-1/2 py-2 px-3 text-left font-semibold text-[#11223a]"><T k="contact.request_type" /></th>
              <th className="w-1/2 py-2 px-3 text-left font-semibold text-[#11223a]"><T k="contact.turnaround" /></th>
            </tr>
          </thead>
          <tbody>
            {responseTable.map(([typeKey, timeKey], i) => (
              <tr key={typeKey} className={i % 2 === 0 ? "bg-white" : "bg-cyan-50"}>
                <td className="py-2 px-3 text-[#11223a]"><T k={typeKey} /></td>
                <td className="py-2 px-3 text-[#11223a]"><T k={timeKey} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      {/* Footer CTA */}
      <article data-section="footer-cta" className="max-w-2xl mx-auto px-4 mt-12 text-center">
        <span className="text-xs text-gray-500">
          <T k="contact.found_error" />&nbsp;
          <a
            href="mailto:support@forexbrokeratings.com?subject=Site%20Error%20Report"
            className="underline text-cyan-700 hover:text-cyan-800 focus:outline focus:outline-2 focus:outline-cyan-400"
          >
            <T k="contact.let_us_know" />
          </a>
        </span>
      </article>
    </main>
  );
}
