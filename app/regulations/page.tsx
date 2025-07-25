"use client";
import React, { useState, useMemo } from "react";
import { BookOpen, ShieldCheck, Percent, Cpu, Grid, Wallet, ArrowRight, ChevronDown, ChevronUp, AlertTriangle, User } from "lucide-react";
import { brokers, Broker } from "@/src/data/brokers";
import { ResponsiveContainer } from "recharts";
import { HexagonChart } from "@/components/broker/hexagon-chart";

const stepCards = [
  {
    title: "Regulation & Safety",
    icon: <ShieldCheck className="w-7 h-7 text-cyan-700" />,
    bullets: [
      "Tier-1 watchdogs (FCA, ASIC, CBI)",
      "Segregated funds",
      "Compensation schemes"
    ]
  },
  {
    title: "Trading Costs",
    icon: <Percent className="w-7 h-7 text-cyan-700" />,
    bullets: ["Compare average EUR/USD spreads & commissions."]
  },
  {
    title: "Execution & Platforms",
    icon: <Cpu className="w-7 h-7 text-cyan-700" />,
    bullets: ["MT4/MT5, cTrader, proprietary apps", "Latency & order types"]
  },
  {
    title: "Product Range",
    icon: <Grid className="w-7 h-7 text-cyan-700" />,
    bullets: ["FX pairs, indices, crypto, shares, options."]
  },
  {
    title: "Account Types & Min Deposit",
    icon: <Wallet className="w-7 h-7 text-cyan-700" />,
    bullets: ["Standard vs Raw/ECN, micro lots, funding methods."]
  },
  {
    title: "Support & Extras",
    icon: <BookOpen className="w-7 h-7 text-cyan-700" />,
    bullets: ["24/5 chat, bonuses, education, copy-trade tools."]
  }
];

const personaData = [
  {
    name: "Day-Trader Bella",
    style: "High-frequency scalping",
    needs: "Ultra-low raw spreads, lightning execution",
    brokers: ["IC Markets Global", "FP Markets"]
  },
  {
    name: "Part-Time Alex",
    style: "Evenings, low capital",
    needs: "Low min deposit, zero-commission standard account",
    brokers: ["XM", "Trade Nation"]
  },
  {
    name: "Algo-Coder Naveen",
    style: "VPS + API trading",
    needs: "FIX/REST API, raw pricing, high leverage",
    brokers: ["RS Finance", "FXCM"]
  }
];

const faqData = [
  {
    q: "What is a Tier-1 regulator?",
    a: "A Tier-1 regulator is a top-level financial watchdog, such as the FCA (UK), ASIC (Australia), or CBI (Ireland), known for strict oversight and client protection."
  },
  {
    q: "Why do spreads vary?",
    a: "Spreads reflect market liquidity, broker model (ECN/STP/MM), and trading hours. Raw accounts offer tight spreads plus commission; standard accounts bundle costs into the spread."
  },
  {
    q: "What platforms do brokers offer?",
    a: "Most offer MT4/MT5, cTrader, or proprietary apps. Platform choice affects execution speed, order types, and available tools."
  },
  {
    q: "How do I check a broker’s licence?",
    a: "Visit the regulator’s official register (e.g., FCA, ASIC) and search for the broker’s name or licence number."
  },
  {
    q: "What’s the minimum deposit?",
    a: "Minimums range from $0 to $200+ depending on broker/account type. Always check the broker’s funding page for up-to-date info."
  },
  {
    q: "Are bonuses and promotions safe?",
    a: "Promotions can offer value but check the terms and ensure the broker is well regulated before participating."
  }
];

function getRadarData(selected: Broker[]) {
  // Normalize and score: higher is better
  // Regulation (tier): 1=5, 2=3, 3=1, Unreg=0
  // Spread: lowest = 5, highest = 1
  // Platform: more = better
  // Range: more = better
  // Support: all 5 for demo
  // Promotions: all 4 for demo
  const spreads = brokers.map(b => b.avgSpread);
  const minSpread = Math.min(...spreads);
  const maxSpread = Math.max(...spreads);
  return selected.map(b => ({
    name: b.name,
    Regulation: b.tier === "1" ? 5 : b.tier === "2" ? 3 : b.tier === "3" ? 1 : 0,
    Spread: 5 - ((b.avgSpread - minSpread) / (maxSpread - minSpread)) * 4, // 5=best, 1=worst
    Platform: Math.min(5, b.platforms.length + 1),
    Range: 3 + Math.round(Math.random() * 2), // Placeholder
    Support: 5,
    Promotions: 4
  }));
}

const RegulationsPage = () => {
  const [selected, setSelected] = useState<Broker[]>([brokers[0]]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [search, setSearch] = useState("");
  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Broker multi-select
  function toggleBroker(b: Broker) {
    setSelected(sel =>
      sel.find(x => x.name === b.name)
        ? sel.filter(x => x.name !== b.name)
        : sel.length < 3 ? [...sel, b] : sel
    );
  }

  // Radar data
  const radarData = useMemo(() => getRadarData(selected), [selected]);

  // Table filter
  const filtered = useMemo(() => brokers.filter(b => b.name.toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <main className="bg-[#f8f9fc] min-h-screen pb-24 font-sans">
      {/* HeroHeader */}
      <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[260px] flex flex-col justify-center items-center text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow">Find Your Ideal Forex Broker</h1>
        <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto">Use our data-driven framework to compare regulation, spreads, platforms and more.</h2>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 focus-visible:ring-2 focus-visible:ring-cyan-400"
          onClick={() => {
            const header = document.querySelector('header');
            const target = document.getElementById('step-guide');
            if (target) {
              const headerHeight = header ? header.offsetHeight : 0;
              const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12; // 12px extra spacing
              window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
          }}
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* StepGuideSection */}
      <section id="step-guide" className="max-w-5xl mx-auto px-4 mb-16">
        <h3 className="text-2xl font-bold mb-6 text-[#0b1e3c]">How to Choose a Broker: 6 Key Steps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stepCards.map((card, i) => (
            <div key={card.title} tabIndex={0} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 items-start hover:-translate-y-1 hover:shadow-xl transition group focus-within:-translate-y-1 focus-within:shadow-xl outline-none">
              <div className="flex items-center gap-3 mb-2">{card.icon}<span className="uppercase text-xs font-bold text-cyan-800 tracking-wider">Step {i+1}</span></div>
              <h4 className="text-lg font-bold text-navy-900 mb-1">{card.title}</h4>
              <ul className="text-gray-700 text-sm list-disc pl-5 space-y-1">
                {card.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* InteractiveCompare */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h3 className="text-2xl font-bold mb-4 text-[#0b1e3c]">Interactive Broker Comparison</h3>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8 ">
          {/* Multi-select */}
          <div className="flex-1 w-full">
          <label className="block text-sm font-semibold mb-2 text-navy-900">Select up to 3 brokers:</label>
          <div className="flex flex-col sm:flex-row gap-3 mb-2">
            {[0, 1, 2].map(idx => (
              <select
                key={idx}
                value={selected[idx]?.name || ''}
                onChange={e => {
                  const val = e.target.value;
                  setSelected(sel => {
                    if (!val) {
                      // Remove this slot
                      return sel.filter((_, i) => i !== idx);
                    }
                    const broker = brokers.find(b => b.name === val);
                    if (!broker) return sel;
                    // Replace or add
                    const newSel = [...sel];
                    newSel[idx] = broker;
                    return newSel.slice(0, 3).filter(Boolean);
                  });
                }}
                className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#00c7d4] focus:outline-none text-sm min-w-[120px] bg-white"
                aria-label={`Broker slot ${idx + 1}`}
              >
                <option value="">Select broker...</option>
                {brokers.map(b => (
                  <option key={b.name} value={b.name} disabled={selected.some((s, i) => s?.name === b.name && i !== idx)}>{b.name}</option>
                ))}
              </select>
            ))}
          </div>
          <div className="text-xs text-gray-500">You can compare up to 3 brokers.</div>

          {/* Selected Brokers Card Grid */}
          {selected.length > 0 && (
            <div className="w-full mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {selected.map((b, idx) => (
                <div key={b.name} className="rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col p-4 h-full min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="h-8 w-8 object-contain" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/default-broker-logo.png'; }} />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">{b.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-base font-semibold text-navy-900 truncate">{b.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-xs text-blue-600 font-semibold">{b.avgSpread ?? '-'} pips</span>
                      <span className="text-[11px] text-gray-500">Min Spread</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-xs text-purple-600 font-semibold">{b.maxLeverage ?? '-'}</span>
                      <span className="text-[11px] text-gray-500">Max Leverage</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {Array.isArray(b.regulation) && b.regulation.length > 0 ? (
                      b.regulation.map((reg, i) => (
                        <span key={reg + i} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700 border border-gray-200 font-medium">{reg}</span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">No regulation info</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          {/* Radar Chart */}
          <div className="flex-1 w-full flex flex-col items-center justify-center min-w-[220px] h-[320px]">
            {/* Overlay up to 3 polygons in one HexagonChart SVG */}
            <div className="text-xs text-gray-500">Broker Matrics</div>

            <div className="relative" style={{ width: 220, height: 220 }}>
            {selected.length > 0 ? (
              <HexagonChart
                data={getRadarData(selected).map((brokerData) => [
                  { label: "Regulation", value: brokerData.Regulation, maxValue: 5 },
                  { label: "Spread", value: brokerData.Spread, maxValue: 5 },
                  { label: "Platform", value: brokerData.Platform, maxValue: 5 },
                  { label: "Instrument Range", value: brokerData.Range, maxValue: 5 },
                  { label: "Support", value: brokerData.Support, maxValue: 5 },
                  { label: "Promotions", value: brokerData.Promotions, maxValue: 5 },
                ])}
                size={220}
                showBg={false}
                strokeColors={["#00c7d4", "#f59e42", "#7c3aed"]}
              />
            ) : (
              <HexagonChart
                data={[[
                  { label: "Regulation", value: 0, maxValue: 5 },
                  { label: "Spread", value: 0, maxValue: 5 },
                  { label: "Platform", value: 0, maxValue: 5 },
                  { label: "Instrument Range", value: 0, maxValue: 5 },
                  { label: "Support", value: 0, maxValue: 5 },
                  { label: "Promotions", value: 0, maxValue: 5 },
                ]]}
                size={220}
                showBg={false}
                strokeColors={["#00c7d4"]}
              />
            )}
          </div>
            {/* Legend */}
            <div className="flex gap-4 mt-3">
              {selected.map((b, idx) => {
                const colors = ["#00c7d4", "#f59e42", "#7c3aed"];
                return (
                  <div key={b.name} className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: colors[idx] }} />
                    <span className="text-xs font-medium text-navy-900">{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BrokersTable */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h3 className="text-2xl font-bold mb-4 text-[#0b1e3c]">Brokers & Key Metrics</h3>
        <input
          type="text"
          placeholder="Search brokers..."
          className="mb-4 px-3 py-2 w-full md:w-1/2 rounded border border-gray-300 focus:ring-2 focus:ring-[#00c7d4] focus:outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search brokers"
        />
        {/* Desktop Table (matches featured-brokers.tsx) */}
        <div className="overflow-x-auto rounded-2xl shadow-lg from-gray-950/90 via-gray-900/90 to-gray-950/95 hidden md:block">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Broker</th>
                <th className="px-4 py-3 font-semibold text-gray-800">Tier-1 Licence(s)</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Avg EUR/USD Spread</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Platforms</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Min Deposit</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Execution Model</th>
                <th className="px-4 py-3 font-semibold text-center text-gray-800">Promotions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              {filtered.map((b, idx) => (
                <tr key={b.name} className="border-b border-gray-200 hover:bg-blue-100 transition cursor-pointer">
                  <td className="px-4 py-3 text-center font-semibold text-[#0b1e3c]">{b.name}</td>
                  <td className="px-4 py-3">{Array.isArray(b.regulation) && b.regulation.length ? b.regulation.join(", ") : <span className="text-gray-400">None</span>}</td>
                  <td className="px-4 py-3 text-center text-cyan-600 font-medium">{typeof b.avgSpread === "number" ? b.avgSpread : <span className="text-gray-400">-</span>}</td>
                  <td className="px-4 py-3 text-center">{Array.isArray(b.platforms) && b.platforms.length ? b.platforms.join(", ") : <span className="text-gray-400">None</span>}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-medium">{typeof b.minDeposit === "number" ? `$${b.minDeposit}` : <span className="text-gray-400">-</span>}</td>
                  <td className="px-4 py-3 text-center">{b.execution ? b.execution : <span className="text-gray-400">-</span>}</td>
                  <td className="px-4 py-3 text-center">{typeof b.promotion === "string" && b.promotion.trim() ? b.promotion : <span className="text-gray-400">None</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards (matches featured-brokers.tsx) */}
        <div className="flex flex-col gap-4 md:hidden">
          {filtered.map((b, idx) => (
            <div key={b.name} className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800 transition">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-black font-bold text-xs shadow bg-white">#{idx + 1}</span>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-full h-full object-contain" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/default-broker-logo.png'; }} />
                  ) : (
                    <span className="text-lg font-bold text-black">{b.name?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-black leading-tight">{b.name}</div>
                  <div className="text-xs text-gray-400">{('year_published' in b && b.year_published) ? String(b.year_published) : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Rating:</span>
                <span className="ml-1 text-xs text-gray-600">{typeof b.avgSpread === 'number' ? b.avgSpread.toFixed(2) : '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Min Spread:</span>
                <span className="text-cyan-600 font-medium">{b.avgSpread ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Max Leverage:</span>
                <span className="text-blue-600 font-medium">{b.maxLeverage ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Min Deposit:</span>
                <span className="text-green-600 font-medium">{b.minDeposit ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-700">Regulated By:</span>
                {Array.isArray(b.regulation) && b.regulation.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {b.regulation.slice(0, 2).map((reg, i) => (
                      <span key={i} className="bg-white text-black px-2 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{reg}</span>
                    ))}
                    {b.regulation.length > 2 && (
                      <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>+{b.regulation.length - 2}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PersonaScenarios */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h3 className="text-2xl font-bold mb-4 text-[#0b1e3c]">Which Broker Fits Your Style?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {personaData.map((p, idx) => (
            <div key={p.name} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2"><User className="w-6 h-6 text-cyan-700" /><span className="font-bold text-navy-900">{p.name}</span></div>
              <div className="text-sm text-gray-700 mb-1"><span className="font-semibold text-[#0b1e3c]">Style:</span> {p.style}</div>
              <div className="text-sm text-gray-700 mb-1"><span className="font-semibold text-[#0b1e3c]">Needs:</span> {p.needs}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {p.brokers.map(b => <a key={b} href="#" className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-semibold hover:bg-cyan-200">{b}</a>)}
              </div>
              {/* <a href="#" className="mt-auto inline-flex items-center gap-2 text-cyan-700 font-semibold hover:underline focus:underline">View Review <ArrowRight className="w-4 h-4" /></a> */}
            </div>
          ))}
        </div>
      </section>

      {/* FAQAccordion */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h3 className="text-2xl font-bold mb-4 text-[#0b1e3c]">Frequently Asked Questions</h3>
        <div className="divide-y divide-gray-200 rounded bg-white shadow">
          {faqData.map((f, idx) => (
            <div key={f.q}>
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none focus-visible:bg-cyan-50"
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                aria-expanded={faqOpen === idx}
                aria-controls={`faq-${idx}`}
              >
                <span className="font-semibold text-navy-900">{f.q}</span>
                {faqOpen === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {faqOpen === idx && (
                <div id={`faq-${idx}`} className="px-5 pb-4 text-gray-700 text-sm" aria-live="polite">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DisclaimerBanner */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 flex items-center gap-3 rounded">
          <AlertTriangle className="text-yellow-500 w-6 h-6" />
          <p className="text-sm text-yellow-900">
            Data verified 24 Jun 2025; always confirm on the broker’s website before opening an account.
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
    </main>
  );
};

export default RegulationsPage;
