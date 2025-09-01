import React from "react";
import ContactClient from "@/components/contact/ContactClient";

export const metadata = {
  title: "Contact Us | ForexBrokerRatings",
  description:
    "Contact ForexBrokerRatings.com for support, questions about broker ratings, or to report a site error. Our team replies within 1 business day.",
};

const advisoryBullets = [
  "We do not provide personalised investment advice.",
  "Account-specific issues (deposits, withdrawals, KYC) should be directed to your broker.",
  "Reporting a site error? Include the page URL or a screenshot for faster resolution.",
];

const responseTable = [
  ["General enquiries", "≤ 1 business day"],
  ["Error reports / data corrections", "1 – 3 business days"],
  ["Privacy or deletion requests", "≤ 30 days"],
];

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12" data-privacy-page>
      {/* Hero Header */}
      <article data-section="hero" className="max-w-2xl mx-auto pt-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#11223a] mb-2">Get in Touch</h1>
        <p className="text-base md:text-lg text-cyan-700 mb-8">Questions about our broker ratings, comparisons, or disclosures? We’re here to help.</p>
      </article>

      {/* Contact Channels + Form (client) */}
      <ContactClient />

      {/* Advisory Section */}
      <article data-section="advisory" className="max-w-2xl mx-auto px-4 mt-12">
        <ul className="list-disc pl-6 text-gray-600 text-sm space-y-2">
          {advisoryBullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </article>

      {/* Response-Time Table */}
      <article data-section="response-table" className="max-w-xl mx-auto px-4 mt-10">
        <table className="w-full border-collapse text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-cyan-50">
              <th className="w-1/2 py-2 px-3 text-left font-semibold text-[#11223a]">Request Type</th>
              <th className="w-1/2 py-2 px-3 text-left font-semibold text-[#11223a]">Typical Turn-Around</th>
            </tr>
          </thead>
          <tbody>
            {responseTable.map(([type, time], i) => (
              <tr key={type} className={i % 2 === 0 ? "bg-white" : "bg-cyan-50"}>
                <td className="py-2 px-3 text-[#11223a]">{type}</td>
                <td className="py-2 px-3 text-[#11223a]">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      {/* Footer CTA */}
      <article data-section="footer-cta" className="max-w-2xl mx-auto px-4 mt-12 text-center">
        <span className="text-xs text-gray-500">
          Found an error?&nbsp;
          <a
            href="mailto:support@forexbrokeratings.com?subject=Site%20Error%20Report"
            className="underline text-cyan-700 hover:text-cyan-800 focus:outline focus:outline-2 focus:outline-cyan-400"
          >
            Let us know
          </a>
        </span>
      </article>
    </main>
  );
}
