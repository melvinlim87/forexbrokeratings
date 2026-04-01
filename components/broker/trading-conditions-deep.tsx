"use client";

import { TrendingDown, Zap, DollarSign, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SpreadRow {
  instrument: string;
  type: string;
  avgSpread: string;
  minSpread: string;
  commission: string;
  swapLong: string;
  swapShort: string;
}

interface ExecutionData {
  avgSpeed: string;
  model: string;
  requotes: string;
  slippage: string;
}

interface HiddenFee {
  name: string;
  amount: string;
  note: string;
}

interface TradingConditionsDeepProps {
  accountType: string;
  spreads: SpreadRow[];
  execution: ExecutionData;
  hiddenFees?: HiddenFee[];
  avgSpreadEurUsd: number;
  commissionRt: number;
  minDeposit: number;
  leverage: string;
  platforms: string[];
}

export function TradingConditionsDeep({
  accountType,
  spreads,
  execution,
  hiddenFees,
  avgSpreadEurUsd,
  commissionRt,
  minDeposit,
  leverage,
  platforms,
}: TradingConditionsDeepProps) {
  const allInCost = avgSpreadEurUsd + (commissionRt / 2 / 10);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
      {/* Compact Header */}
      <div className="flex items-center gap-2 mb-2">
        <TrendingDown className="h-4 w-4 text-emerald-400" />
        <h3 className="text-base font-semibold text-white">Trading Conditions</h3>
        <span className="text-[10px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded">{accountType}</span>
      </div>

      {/* Compact Quick Stats Row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-base border-b border-gray-800/30 pb-2">
        <span><span className="text-gray-500">EUR/USD:</span> <span className="text-emerald-400 font-semibold">{avgSpreadEurUsd} pips</span></span>
        <span><span className="text-gray-500">Commission:</span> <span className="text-white font-medium">{commissionRt > 0 ? `$${commissionRt}/lot RT` : 'None'}</span></span>
        <span><span className="text-gray-500">All-In:</span> <span className="text-amber-400 font-semibold">{allInCost.toFixed(2)} pips</span></span>
        <span><span className="text-gray-500">Min Deposit:</span> <span className="text-white font-medium">${minDeposit}</span></span>
        <span><span className="text-gray-500">Leverage:</span> <span className="text-white font-medium">{leverage}</span></span>
      </div>

      {/* Compact Spread Table */}
      {spreads.length > 0 && (
        <div className="mb-2">
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Pair</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Avg</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Min</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Comm</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Swp L</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Swp S</th>
                </tr>
              </thead>
              <tbody>
                {spreads.map((row, i) => (
                  <tr key={i} className="border-b border-gray-800/20 hover:bg-gray-800/20">
                    <td className="py-2 px-3 text-white font-medium">{row.instrument}</td>
                    <td className="py-2 px-3 text-gray-400">{row.type}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-medium">{row.avgSpread}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{row.minSpread}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{row.commission}</td>
                    <td className="py-2 px-3 text-right text-gray-400">{row.swapLong}</td>
                    <td className="py-2 px-3 text-right text-gray-400">{row.swapShort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Execution Details — inline row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-base py-1.5 border-t border-gray-800/30">
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-amber-400" />
          <span className="text-gray-500">Speed:</span>
          <span className="text-white font-medium">{execution.avgSpeed}</span>
        </span>
        <span><span className="text-gray-500">Model:</span> <span className="text-white font-medium">{execution.model}</span></span>
        <span><span className="text-gray-500">Requotes:</span> <span className="text-white font-medium">{execution.requotes}</span></span>
        <span><span className="text-gray-500">Slippage:</span> <span className="text-white font-medium">{execution.slippage}</span></span>
      </div>

      {/* Hidden Fees — compact inline */}
      {hiddenFees && hiddenFees.length > 0 && (() => {
        const chargedFees = hiddenFees.filter(fee => fee.note || (fee.amount && fee.amount !== '$0'));
        const allFree = chargedFees.length === 0;
        const displayFees = allFree ? hiddenFees : chargedFees;
        return (
        <div className={`mt-1.5 rounded px-2 py-1.5 ${allFree ? 'bg-emerald-500/5 border border-emerald-500/15' : 'bg-amber-500/5 border border-amber-500/15'}`}>
          <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase mb-1 ${allFree ? 'text-emerald-400' : 'text-amber-400'}`}>
            {allFree ? <DollarSign className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            {allFree ? 'Fee Summary' : 'Watch Out'}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-base">
            {displayFees.map((fee, i) => (
              <span key={i}>
                <span className="text-gray-300">{fee.name}:</span>
                <span className={`ml-1 font-medium ${allFree ? 'text-emerald-400' : 'text-amber-400'}`}>{fee.amount}</span>
              </span>
            ))}
          </div>
        </div>
        );
      })()}

      {/* Platforms — inline badges */}
      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-gray-500 uppercase">Platforms:</span>
        {platforms.map((p, i) => (
          <span key={i} className="text-[10px] bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded">{p}</span>
        ))}
      </div>
    </div>
  );
}
