// Shared FAQ data — used by both FAQSchema (structured data) and HomeFAQ (rendered component).
// Keeping these in sync prevents Google from seeing duplicate/conflicting FAQ structured data.

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "What is the best forex broker in 2026?",
    answer: "Based on our analysis of 200+ data points across 50+ brokers, Pepperstone ranks #1 overall with a 9.6/10 rating. IC Markets is the best choice for professional traders seeking institutional-grade ECN execution, while XM leads for beginners with a $5 minimum deposit and excellent educational resources. Our ratings weigh regulation (25%), fees (20%), platforms (20%), instruments (15%), user sentiment (10%), and support (10%)."
  },
  {
    question: "How do I choose a forex broker?",
    answer: "Follow this checklist: (1) Verify regulation — FCA, ASIC, or CySEC are gold standard; (2) Compare total trading costs — spreads + commissions + swap rates on your favorite pairs; (3) Test the platform — open a demo account first; (4) Check the instrument range — make sure your preferred markets are available; (5) Read real user reviews on TrustPilot and Reddit; (6) Test withdrawal speed before committing large capital. For a detailed step-by-step guide, see our How to Choose a Forex Broker guide at /guides/how-to-choose."
  },
  {
    question: "Are forex brokers safe?",
    answer: "Brokers regulated by Tier-1 authorities (FCA UK, ASIC Australia, CFTC/NFA USA, CySEC Cyprus, MAS Singapore) are generally safe. These regulators mandate client fund segregation at Tier-1 banks, negative balance protection, and regular financial audits. Offshore-only brokers (FSA Seychelles, VFSC Vanuatu, SVG) offer significantly weaker protections. Always verify a broker's license directly on the regulator's website before depositing."
  },
  {
    question: "What is the minimum deposit for forex trading?",
    answer: "You can start with as little as $0 at Fusion Markets or $5 at XM. Most competitive ECN brokers like Pepperstone ($200), IC Markets ($200), and Vantage ($50) have low minimums. Premium brokers like Saxo Bank have removed their minimum deposit requirements. For meaningful trading with proper risk management, we recommend starting with at least $500-$1,000."
  },
  {
    question: "What forex broker has the lowest spreads?",
    answer: "Fusion Markets leads with raw spreads averaging 0.07 pips on EUR/USD and just $4.50/lot round-turn commission — the lowest total cost in the industry. IC Markets follows at 0.1 pips ($7/lot RT). For zero-commission accounts, ActivTrades offers 0.5 pips EUR/USD with no commission. Keep in mind that total cost includes spreads, commissions, swap rates, and any hidden fees."
  },
  {
    question: "How do we rate forex brokers?",
    answer: "Our ratings are built on 200+ verified data points per broker across 7 categories: Regulation & Security (25%), Trading Fees (20%), Platform Quality (20%), Instrument Range (15%), User Reviews (10%), and Customer Support (10%). We verify regulatory status directly with FCA, ASIC, CySEC, and other regulators. Spread data is cross-checked with broker websites and independent testing. User reviews are aggregated from TrustPilot, Forex Peace Army, Reddit, and trading forums."
  },
];
