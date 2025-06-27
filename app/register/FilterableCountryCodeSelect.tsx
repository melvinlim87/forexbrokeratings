"use client";
import { useEffect, useState } from "react";

export interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}

export default function FilterableCountryCodeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [codes, setCodes] = useState<CountryCode[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/CountryCodes.json")
      .then((res) => res.json())
      .then(setCodes)
      .catch(() => setCodes([]));
  }, []);

  const filtered = codes.filter(
    c =>
      c.name.toLowerCase().includes(input.toLowerCase()) ||
      c.dial_code.replace('+','').includes(input.replace('+','')) ||
      c.code.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        className="block w-full rounded-md border border-border bg-white dark:bg-background px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        placeholder="Country Code..."
        value={input}
        onChange={e => {
          setInput(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white dark:bg-background border border-border rounded-md shadow-lg">
          {filtered.map((c) => (
            <li
              key={c.code}
              className={`px-3 py-2 cursor-pointer hover:bg-cyan-100 dark:hover:bg-cyan-900 ${value === c.dial_code ? 'bg-cyan-50 dark:bg-cyan-800' : ''}`}
              onMouseDown={() => {
                onChange(c.dial_code);
                setInput(`+${c.dial_code}`);
                setOpen(false);
              }}
            >
              (+{c.dial_code}) {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
