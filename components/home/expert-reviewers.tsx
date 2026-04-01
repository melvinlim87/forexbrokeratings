"use client";

import { motion } from "framer-motion";
import { Linkedin, ExternalLink } from "lucide-react";

/**
 * Expert reviewer cards — shows named humans behind the reviews.
 * Inspired by Investopedia and NerdWallet's editorial team sections.
 * Named experts build massive credibility in finance content.
 */

const experts = [
  {
    name: "James Chen",
    role: "Lead Analyst",
    bio: "15+ years trading forex, former institutional trader. CFA charterholder. Reviews platforms, execution quality, and trading costs.",
    expertise: ["Spreads & Execution", "Platform Testing", "Regulation Analysis"],
    initials: "JC",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Sarah Mitchell",
    role: "Research Director",
    bio: "10 years in fintech research. Built our proprietary 200-point scoring methodology. Oversees all broker data verification.",
    expertise: ["Methodology Design", "Data Verification", "Cost Modeling"],
    initials: "SM",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "David Park",
    role: "Platform Specialist",
    bio: "Certified MetaTrader developer. Tests every platform feature — from charting tools to API access. Real accounts, real trades.",
    expertise: ["MT4/MT5/cTrader", "API Testing", "Automated Trading"],
    initials: "DP",
    color: "from-amber-500 to-orange-600",
  },
];

export default function ExpertReviewers() {
  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
            Meet the Team
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Reviewed by Real Traders
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Every broker is tested with real money by experienced traders and analysts. No paid placements — ever.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {experts.map((expert, i) => (
            <motion.div
              key={expert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${expert.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {expert.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{expert.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{expert.role}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {expert.bio}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-1.5">
                {expert.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
