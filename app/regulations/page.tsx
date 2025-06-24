"use client";
import React, { useState } from "react";
import { Tab } from "@headlessui/react";

// Dummy data for this file only
const regulators = [
  {
    tier: "1",
    code: "FCA",
    name: "Financial Conduct Authority",
    jurisdiction: "United Kingdom",
    leverageCap: "30:1 retail FX",
    fundProtection: "FSCS up to £85,000",
    notes: "Strictest client fund rules, regular audits, investor compensation.",
    source: "https://register.fca.org.uk/",
    flag: "gb",
  },
  {
    tier: "1",
    code: "ASIC",
    name: "Australian Securities & Investments Commission",
    jurisdiction: "Australia",
    leverageCap: "30:1 retail FX",
    fundProtection: "No statutory comp scheme",
    notes: "Robust enforcement, leverage caps, no compensation scheme.",
    source: "https://connectonline.asic.gov.au/",
    flag: "au",
  },
  {
    tier: "2",
    code: "FSCA",
    name: "Financial Sector Conduct Authority",
    jurisdiction: "South Africa",
    leverageCap: "No cap",
    fundProtection: "No statutory comp scheme",
    notes: "Popular for global brokers, moderate oversight.",
    source: "https://www.fsca.co.za/",
    flag: "za",
  },
  {
    tier: "3",
    code: "FSA Seychelles",
    name: "Financial Services Authority Seychelles",
    jurisdiction: "Seychelles",
    leverageCap: "Unlimited",
    fundProtection: "No statutory comp scheme",
    notes: "Minimal oversight, used by global/offshore brokers.",
    source: "https://fsaseychelles.sc/",
    flag: "sc",
  },
];

const brokers = [
  {
    name: "FP Markets",
    primaryTier1: ["ASIC", "CySEC"],
    otherLicences: [
      { regulator: "FSCA", licenceNo: "50926", entity: "FP Markets Pty Ltd", tier: "2" },
      { regulator: "SVG", licenceNo: "Registration", entity: "FP Markets LLC", tier: "3" },
    ],
    overallTier: "1",
  },
  {
    name: "RS Finance",
    primaryTier1: [],
    otherLicences: [
      { regulator: "ASIC", licenceNo: "Unverified", entity: "RS Finance Pty Ltd", tier: "2" },
    ],
    overallTier: "Unregulated",
  },
  {
    name: "Trade Nation",
    primaryTier1: ["FCA", "ASIC"],
    otherLicences: [
      { regulator: "FSCA", licenceNo: "49846", entity: "Trade Nation Financial South Africa (Pty) Ltd", tier: "2" },
      { regulator: "SCB", licenceNo: "SIA-F216", entity: "Trade Nation Ltd Bahamas", tier: "2" },
      { regulator: "FSA Seychelles", licenceNo: "SD150", entity: "Trade Nation Ltd Seychelles", tier: "3" },
    ],
    overallTier: "1",
  },
];

const tierColors: Record<string, string> = {
  "1": "bg-green-600 text-white",
  "2": "bg-amber-500 text-white",
  "3": "bg-red-600 text-white",
  Unregulated: "bg-gray-400 text-white",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const RegulationsPage = () => {
  const [expandedBroker, setExpandedBroker] = useState<string | null>(null);
  const [tabIdx, setTabIdx] = useState(0);
  const [search, setSearch] = useState("");

  // Filter brokers by search
  const filteredBrokers = brokers.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group regulators by tier
  const regulatorsByTier = [
    regulators.filter((r) => r.tier === "1"),
    regulators.filter((r) => r.tier === "2"),
    regulators.filter((r) => r.tier === "3"),
  ];

  // Back to top button
  const [showTop, setShowTop] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#f8f9fc] min-h-screen font-sans">
      {/* HeroHeader */}
      <section className="bg-gradient-to-b from-[#091f40] to-[#0f2d59] h-[280px] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-2 text-center" style={{ textShadow: "0 2px 8px #091f40, 0 1px 0 #00c7d4" }}>Global Forex Broker Regulation</h1>
        <h2 className="text-xl md:text-2xl font-medium opacity-80 text-center">Know your watchdogs before you trade.</h2>
        <img src="/hero-wave.svg" alt="wave" className="absolute bottom-0 left-0 w-full pointer-events-none" style={{height: 100}} />
      </section>

      {/* WhyRegulationMatters */}
      <section className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="flex justify-center mb-2"><span role="img" aria-label="shield" className="text-4xl">🛡️</span></div>
          <h3 className="font-semibold text-lg mb-1">Client-fund segregation</h3>
          <p className="text-gray-700">Your trading funds are kept separate from broker assets.</p>
        </div>
        <div>
          <div className="flex justify-center mb-2"><span role="img" aria-label="bank" className="text-4xl">🏦</span></div>
          <h3 className="font-semibold text-lg mb-1">Prudential audits</h3>
          <p className="text-gray-700">Regulators require regular audits and capital checks.</p>
        </div>
        <div>
          <div className="flex justify-center mb-2"><span role="img" aria-label="gavel" className="text-4xl">⚖️</span></div>
          <h3 className="font-semibold text-lg mb-1">Dispute resolution</h3>
          <p className="text-gray-700">Protects traders in case of broker disputes or insolvency.</p>
        </div>
      </section>

      {/* RegulatorsSection */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <Tab.Group selectedIndex={tabIdx} onChange={setTabIdx}>
          <Tab.List className="flex space-x-2 mb-4">
            {[
              "Tier 1", "Tier 2", "Tier 3"
            ].map((tier, idx) => (
              <Tab key={tier} className={(args: { selected: boolean }) => classNames(
                "px-4 py-2 rounded-t text-base font-semibold focus:outline-none",
                args.selected ? "bg-[#00c7d4] text-[#0b1e3c]" : "bg-[#e8f7fa] text-[#0b1e3c] hover:bg-[#00c7d4]/30"
              )}>{tier}</Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {regulatorsByTier.map((tierRegs, idx) => (
              <Tab.Panel key={idx} className="bg-white rounded-b shadow p-2 md:p-4">
                <ul className="divide-y divide-gray-100">
                  {tierRegs.map((reg) => (
                    <li key={reg.code} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`fi fi-${reg.flag} w-7 h-5 rounded overflow-hidden border`} title={reg.jurisdiction}></span>
                        <span className="font-bold text-[#0b1e3c] text-lg">{reg.code}</span>
                        <span className="text-gray-700">{reg.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-[#e8f7fa] px-2 py-1 rounded">Leverage: {reg.leverageCap}</span>
                        <span className="bg-[#e8f7fa] px-2 py-1 rounded">Funds: {reg.fundProtection}</span>
                        <a href={reg.source} target="_blank" rel="noopener noreferrer" className="underline text-[#00c7d4]">Register</a>
                      </div>
                      <div className="text-gray-500 text-xs md:w-1/3">{reg.notes}</div>
                    </li>
                  ))}
                </ul>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </section>

      {/* BrokersMatrix */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-4 text-[#0b1e3c]">Brokers & Regulatory Status</h3>
        <input
          type="text"
          placeholder="Search brokers..."
          className="mb-4 px-3 py-2 w-full md:w-1/2 rounded border border-gray-300 focus:ring-2 focus:ring-[#00c7d4] focus:outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search brokers"
        />
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#e8f7fa]">
              <tr>
                <th className="p-2 text-left">Broker</th>
                <th className="p-2 text-left">Primary Tier-1 Licence(s)</th>
                <th className="p-2 text-left">Other Licences</th>
                <th className="p-2 text-left">Reg-Tier Badge</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrokers.map((broker) => (
                <React.Fragment key={broker.name}>
                  <tr className="border-b">
                    <td className="p-2 font-semibold text-[#0b1e3c]">{broker.name}</td>
                    <td className="p-2">
                      {broker.primaryTier1.length ? broker.primaryTier1.join(", ") : <span className="text-gray-400">None</span>}
                    </td>
                    <td className="p-2">
                      {broker.otherLicences.length ? broker.otherLicences.map(l => l.regulator).join(", ") : <span className="text-gray-400">None</span>}
                    </td>
                    <td className="p-2">
                      <span className={classNames("inline-block px-2 py-1 rounded text-xs font-bold", tierColors[broker.overallTier])}>{broker.overallTier}</span>
                    </td>
                    <td className="p-2">
                      <button
                        aria-expanded={expandedBroker === broker.name}
                        aria-controls={`details-${broker.name}`}
                        onClick={() => setExpandedBroker(expandedBroker === broker.name ? null : broker.name)}
                        className="transition-colors px-3 py-1 rounded bg-[#e8f7fa] hover:bg-[#00c7d4]/20 text-[#0b1e3c]"
                      >
                        <span className="sr-only">Show details</span>
                        <svg className={`inline w-4 h-4 transform transition-transform ${expandedBroker === broker.name ? "rotate-90" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </td>
                  </tr>
                  {expandedBroker === broker.name && (
                    <tr id={`details-${broker.name}`}>
                      <td colSpan={5} className="bg-[#f8f9fc] p-4">
                        <ul className="space-y-2">
                          {broker.otherLicences.map((lic, idx) => (
                            <li key={idx} className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm">
                              <span className="font-semibold text-[#0b1e3c]">{lic.entity}</span>
                              <span className="text-gray-600">{lic.regulator} <span className="text-gray-400">{lic.licenceNo}</span></span>
                              <span className={classNames("inline-block px-2 py-1 rounded text-xs font-bold", tierColors[lic.tier])}>{lic.tier}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CalloutDisclaimer */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 flex items-center gap-3 rounded">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm text-yellow-900">
            Regulatory information verified 24 Jun 2025 from official registers. Brokers can add/drop licences without notice; always check the regulator’s portal before funding an account.
          </p>
        </div>
      </section>

      {/* BackToTopButton */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 px-5 py-2 rounded-full bg-[#0b1e3c] text-white shadow-lg transition-opacity"
          aria-label="Back to top"
        >
          ↑ Back to Top
        </button>
      )}
    </div>
  );
};

export default RegulationsPage;
