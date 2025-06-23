import React from "react";

export const metadata = {
  title: "Contact Us | ForexBrokerRatings",
  description:
    "Contact ForexBrokerRatings.com for support, questions about broker ratings, or to report a site error. Our team replies within 1 business day.",
};

const channels = [
  {
    icon: (
      <svg aria-label="Email" className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 0l8 8m8-8l-8 8" /></svg>
    ),
    label: "Email",
    state: "active",
    description:
      "Best way to reach us. We reply within 1 business day (Mon–Fri, UTC ±0).",
    cta: (
      <a
        href="mailto:support@forexbrokerratings.com"
        className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-white bg-cyan-700 rounded-md shadow hover:bg-cyan-800 focus:outline focus:outline-2 focus:outline-cyan-400 transition-colors duration-150"
      >
        Email Us
      </a>
    ),
  },
  {
    icon: (
      <svg aria-label="Telegram" className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 4L12 20l-4-7-7-2z" /></svg>
    ),
    label: "Telegram",
    state: "soon",
    description:
      "@FXBrokerratings will launch shortly. Stay tuned!",
    cta: (
      <button
        disabled
        className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-gray-500 bg-gray-200 rounded-md cursor-not-allowed border border-gray-300"
        aria-disabled="true"
      >
        Coming Soon
      </button>
    ),
  },
  {
    icon: (
      <svg aria-label="Instagram" className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
    ),
    label: "Instagram",
    state: "soon",
    description:
      "DM support via @forexbrokerratings will be available soon.",
    cta: (
      <button
        disabled
        className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-gray-500 bg-gray-200 rounded-md cursor-not-allowed border border-gray-300"
        aria-disabled="true"
      >
        Coming Soon
      </button>
    ),
  },
];

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

      {/* Contact Cards Grid */}
      <article data-section="channels" className="max-w-4xl mx-auto px-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((ch, i) => (
            <div
              key={ch.label}
              className={`relative group bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-start transition-shadow duration-150 ease-in-out hover:shadow-lg focus-within:shadow-lg ${ch.state === "soon" ? "opacity-70" : ""}`}
              tabIndex={ch.state === "active" ? 0 : -1}
            >
              <span className="absolute top-4 left-4">{ch.icon}</span>
              <span className="ml-12 text-lg font-semibold text-[#11223a] mb-1">{ch.label}</span>
              {ch.state === "soon" && (
                <span className="ml-12 mb-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-500 font-medium inline-block">Coming Soon</span>
              )}
              <span className="ml-12 text-gray-700 text-sm mb-4 block min-h-[48px]">{ch.description}</span>
              <div className="ml-12">{ch.cta}</div>
            </div>
          ))}
        </div>
      </article>

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
            href="mailto:support@forexbrokerratings.com?subject=Site%20Error%20Report"
            className="underline text-cyan-700 hover:text-cyan-800 focus:outline focus:outline-2 focus:outline-cyan-400"
          >
            Let us know
          </a>
        </span>
      </article>
    </main>
  );
}
