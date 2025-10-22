"use client";
import { useEffect, useState } from "react";

export interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}

export default function CountryCodeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [codes, setCodes] = useState<CountryCode[]>([]);

  useEffect(() => {
    fetch("/CountryCodes.json")
      .then((res) => res.json())
      .then(setCodes)
      .catch(() => setCodes([]));
  }, []);

  return (
    <select
      className="block w-full rounded-md border border-border bg-white px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">Select Country Code</option>
      {codes.map((c) => (
        <option key={c.code} value={c.dial_code}>
          (+{c.dial_code}) {c.name}
        </option>
      ))}
    </select>
  );
}
