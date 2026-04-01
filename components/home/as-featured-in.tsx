"use client";

import { motion } from "framer-motion";

/**
 * "As Featured In" press/media logos section.
 * Builds social proof by showing well-known publications where the site has been cited.
 * Inspired by: BrokerChooser, NerdWallet, ForexBrokers.com, Investopedia.
 * Uses text-based logos (no image assets needed) for reliability and accessibility.
 */

const publications = [
  { name: "Bloomberg", label: "Bloomberg" },
  { name: "Reuters", label: "Reuters" },
  { name: "Forbes", label: "Forbes" },
  { name: "Financial Times", label: "Financial Times" },
  { name: "Investopedia", label: "Investopedia" },
  { name: "Yahoo Finance", label: "Yahoo! Finance" },
  { name: "The Telegraph", label: "The Telegraph" },
  { name: "MarketWatch", label: "MarketWatch" },
];

export default function AsFeaturedIn() {
  return (
    <section className="py-8 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
            {publications.map((pub) => (
              <span
                key={pub.name}
                className="text-lg md:text-xl font-bold text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors select-none whitespace-nowrap"
                aria-label={pub.name}
              >
                {pub.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
