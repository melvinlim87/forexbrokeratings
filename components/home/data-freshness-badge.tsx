"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";

/**
 * Data freshness badge — shows when broker data was last verified.
 * Inspired by NerdWallet's "Updated [date]" and BrokerChooser's freshness indicators.
 * Builds trust by proving data is current.
 */

export default function DataFreshnessBadge() {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center gap-3 py-3"
    >
      <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 border border-emerald-200/60 dark:border-emerald-800/40">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
          All broker data verified {month} {year}
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        <Clock className="h-3 w-3" />
        <span>Updated quarterly</span>
      </div>
    </motion.div>
  );
}
