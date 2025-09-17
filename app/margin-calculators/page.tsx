"use client";

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ACCOUNT_CURRENCIES,
  CURRENCY_PAIRS,
  MARGIN_RATIOS,
  AccountCurrency,
  CurrencyPair,
  MarginRatioLabel,
} from '@/data/margin-calculator';

// Helper to parse a label like "100:1" to a number 100
function parseLeverage(label: MarginRatioLabel): number {
  const [num] = label.split(":");
  const n = Number(num.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 1;
}

// Very simplified spot rates map for demonstration. In production, fetch live quotes.
const SPOT_RATES: Record<string, number> = {
  EURUSD: 1.08,
  USDJPY: 156.50,
  GBPUSD: 1.27,
  AUDUSD: 0.66,
  USDCHF: 0.90,
  USDCAD: 1.36,
  EURJPY: 1.08 * 156.5, // cross
  EURGBP: 1.08 / 1.27,  // cross
  GBPJPY: 1.27 * 156.5, // cross
};

// Return quote currency from a pair like "EURUSD" => "USD"
function quoteCcy(pair: CurrencyPair): string { return pair.slice(3, 6); }

// Compute rate from one currency to another using SPOT_RATES where possible
function convert(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  // Try direct pair
  const direct = `${from}${to}`;
  if (SPOT_RATES[direct] != null) return amount * SPOT_RATES[direct];
  // Try inverse pair
  const inverse = `${to}${from}`;
  if (SPOT_RATES[inverse] != null) return amount / SPOT_RATES[inverse];
  // Fallback: no conversion path, return amount unchanged
  return amount;
}

export default function MarginCalculatorPage() {
  const [pair, setPair] = useState<CurrencyPair>('EURUSD');
  const [accountCcy, setAccountCcy] = useState<AccountCurrency>('USD');
  const [marginRatio, setMarginRatio] = useState<MarginRatioLabel>('100:1');
  const [lotSize, setLotSize] = useState<string>('1');

  const [hasCalculated, setHasCalculated] = useState(false);

  const leverage = useMemo(() => parseLeverage(marginRatio), [marginRatio]);

  // Calculation: Notional (in quote ccy) = lotSize * 100,000
  // Required Margin (in quote) = Notional / leverage
  // Convert margin from quote to account currency if needed.
  const { result, spotUsed } = useMemo(() => {
    const lots = Math.max(0, Number(lotSize.replace(/,/g, '')) || 0);
    const units = lots * 100_000; // standard lot
    const q = quoteCcy(pair);
    const marginInQuote = units / leverage;
    const marginInAccount = convert(marginInQuote, q, accountCcy);
    const rateShown = convert(1, q, accountCcy);
    return {
      result: marginInAccount,
      spotUsed: { from: q, to: accountCcy, rate: rateShown },
    };
  }, [pair, accountCcy, leverage, lotSize]);

  function formatMoney(value: number, ccy: string) {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: ccy }).format(value);
    } catch {
      // Fallback if the currency code isn't supported by the runtime
      return `${ccy} ${value.toLocaleString()}`;
    }
  }

  const reset = () => {
    setPair('EURUSD');
    setAccountCcy('USD');
    setMarginRatio('100:1');
    setLotSize('1');
    setHasCalculated(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
          {hasCalculated ? `${pair} Margin Calculator` : 'Margin Calculator'}
        </h2>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-slate-600 dark:text-slate-300">Currency Pair</label>
            <Select value={pair} onValueChange={(v) => setPair(v as CurrencyPair)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_PAIRS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-slate-600 dark:text-slate-300">Account Currency</label>
            <Select value={accountCcy} onValueChange={(v) => setAccountCcy(v as AccountCurrency)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-slate-600 dark:text-slate-300">Margin Ratio</label>
            <Select value={marginRatio} onValueChange={(v) => setMarginRatio(v as MarginRatioLabel)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select margin ratio" />
              </SelectTrigger>
              <SelectContent>
                {MARGIN_RATIOS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-slate-600 dark:text-slate-300">Trade Size (Lots)</label>
            <Input
              type="number"
              inputMode="decimal"
              className="w-56"
              min={0}
              step={0.01}
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={() => setHasCalculated(true)}>Calculate</Button>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-6 md:pt-0 md:pl-6">
          {!hasCalculated ? (
            <p className="text-slate-500 dark:text-slate-400">Fill the values and click Calculate to see your required margin.</p>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-slate-600 dark:text-slate-300">Spot used ({spotUsed.from}/{spotUsed.to}): {spotUsed.rate?.toFixed(6)}</div>
              <div className="text-lg font-semibold">Result: {formatMoney(result, accountCcy)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
