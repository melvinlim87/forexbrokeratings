"use client";
import React, { useState } from "react";
import { Tab } from "@headlessui/react";

import { fetchRegulators, Regulators, fetchAllBrokerDetails } from "@/lib/supabase";

// Remove static brokers array


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
  const [regulators, setRegulators] = useState<Regulators[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Brokers state
  const [brokers, setBrokers] = useState<any[]>([]);
  const [brokersLoading, setBrokersLoading] = useState(true);
  const [brokersError, setBrokersError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchRegulators()
      .then((data) => {
        setRegulators(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // Fetch brokers from Supabase
    fetchAllBrokerDetails()
      .then((data) => {
        setBrokers(data || []);
        setBrokersLoading(false);
      })
      .catch((err) => {
        setBrokersError(err.message);
        setBrokersLoading(false);
      });
  }, []);

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

  if (loading || brokersLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading data...</div>;
  }
  if (error || brokersError) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Failed to load: {error || brokersError}</div>;
  }

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
          {regulatorsByTier.map((tierRegs: Regulators[], idx: number) => (
            <Tab.Panel key={idx} className="bg-white rounded-b shadow p-2 md:p-4">
              <ul className="flex flex-wrap gap-4">
                {tierRegs.map((reg: Regulators) => (
                  <li
                    key={reg.code}
                    className="flex flex-row items-center gap-4 rounded-xl px-4 py-3 bg-white w-full shadow-md min-h-[120px] w-full"
                  >
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-white rounded-lg border border-gray-100">
                      <img src={reg.image} alt={reg.name} className="w-16 h-16 object-contain" />
                    </div>
                    {/* Center: Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#0b1e3c] font-bold text-2xl truncate max-w-[200px]">{reg.name}</span>
                        <span className="text-gray-600 text-base font-semibold truncate max-w-[120px]">{reg.code}</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{Array.isArray(reg.jurisdiction) ? reg.jurisdiction.join(", ") : reg.jurisdiction}</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Established in {reg.published_year || 'N/A'}</span>
                      </div>
                      {reg.notes && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {reg.notes}
                          </span>
                        </div>
                      )}
                    </div>
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
  <table className="min-w-full text-sm hidden md:table">
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
      {brokers
        .filter((b: any) => (b.name || "").toLowerCase().includes(search.toLowerCase()))
        .map((broker: any) => {
          // Derive primaryTier1, otherLicences, overallTier from broker fields if needed
          // Fallbacks for demo: treat 'licenses' as otherLicences, 'regulators' as primaryTier1
          const primaryTier1 = Array.isArray(broker.regulators) ? broker.regulators : [];
          const otherLicences = Array.isArray(broker.licenses)
            ? broker.licenses.map((lic: string, idx: number) => ({
                regulator: lic,
                licenceNo: broker.license_numbers?.[idx] || '',
                entity: broker.name,
                tier: broker.tier || '2',
              }))
            : [];
          const overallTier = broker.tier || (broker.is_regulated ? "1" : "Unregulated");
          return (
            <React.Fragment key={broker.id || broker.name}>
              <tr className="border-b">
                <td className="p-2 font-semibold text-[#0b1e3c]">{broker.name}</td>
                <td className="p-2">
                  {primaryTier1.length ? primaryTier1.join(", ") : <span className="text-gray-400">None</span>}
                </td>
                <td className="p-2">
                  {otherLicences.length ? otherLicences.map((l: any) => l.regulator).join(", ") : <span className="text-gray-400">None</span>}
                </td>
                <td className="p-2">
                  <span className={classNames("inline-block px-2 py-1 rounded text-xs font-bold", tierColors[overallTier])}>{overallTier}</span>
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
                      {otherLicences.map((lic: any, idx: number) => (
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
          );
        })}
    </tbody>
  </table>
  {/* Mobile vertical cards */}
  <div className="flex flex-col gap-4 md:hidden p-2">
    {brokers
      .filter((b: any) => (b.name || "").toLowerCase().includes(search.toLowerCase()))
      .map((broker: any) => {
        const primaryTier1 = Array.isArray(broker.regulators) ? broker.regulators : [];
        const otherLicences = Array.isArray(broker.licenses)
          ? broker.licenses.map((lic: string, idx: number) => ({
              regulator: lic,
              licenceNo: broker.license_numbers?.[idx] || '',
              entity: broker.name,
              tier: broker.tier || '2',
            }))
          : [];
        const overallTier = broker.tier || (broker.is_regulated ? "1" : "Unregulated");
        return (
          <div key={broker.id || broker.name} className="bg-white rounded shadow border border-gray-100">
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#0b1e3c] text-lg">{broker.name}</span>
                <span className={classNames("inline-block px-2 py-1 rounded text-xs font-bold", tierColors[overallTier])}>{overallTier}</span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-xs text-gray-500">Primary Tier-1 Licence(s): <span className="font-medium text-[#0b1e3c]">{primaryTier1.length ? primaryTier1.join(", ") : "None"}</span></span>
                <span className="text-xs text-gray-500">Other Licences: <span className="font-medium text-[#0b1e3c]">{otherLicences.length ? otherLicences.map((l: any) => l.regulator).join(", ") : "None"}</span></span>
              </div>
              <button
                aria-expanded={expandedBroker === broker.name}
                aria-controls={`details-${broker.name}`}
                onClick={() => setExpandedBroker(expandedBroker === broker.name ? null : broker.name)}
                className="transition-colors px-3 py-1 mt-2 rounded bg-[#e8f7fa] hover:bg-[#00c7d4]/20 text-[#0b1e3c] w-fit self-end"
              >
                <span className="sr-only">Show details</span>
                <svg className={`inline w-4 h-4 transform transition-transform ${expandedBroker === broker.name ? "rotate-90" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              {expandedBroker === broker.name && (
                <div id={`details-${broker.name}`} className="bg-[#f8f9fc] mt-2 rounded p-2">
                  <ul className="space-y-2">
                    {otherLicences.map((lic: any, idx: number) => (
                      <li key={idx} className="flex flex-col gap-1 text-sm">
                        <span className="font-semibold text-[#0b1e3c]">{lic.entity}</span>
                        <span className="text-gray-600">{lic.regulator} <span className="text-gray-400">{lic.licenceNo}</span></span>
                        <span className={classNames("inline-block px-2 py-1 rounded text-xs font-bold", tierColors[lic.tier])}>{lic.tier}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
  </div>
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
