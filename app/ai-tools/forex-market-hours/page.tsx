'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n-client';

// ---- Types ----
export type SessionKey = 'sydney' | 'tokyo' | 'london' | 'newyork';

export type Session = {
  key: SessionKey;
  name: string;
  // UTC 24h times, inclusive start, exclusive end
  utcOpenHour: number;  // 0-23
  utcCloseHour: number; // 0-23 (can be less than open if wraps past midnight)
};

export type SessionRuntime = Session & {
  openLocal: string;  // e.g., 07:00 AM
  closeLocal: string; // e.g., 04:00 PM
  isOpenNow: boolean;
};

// ---- Session definitions (UTC anchors) ----
const SESSIONS: Session[] = [
  { key: 'sydney',  name: 'Sydney',  utcOpenHour: 22, utcCloseHour: 7 },
  { key: 'tokyo',   name: 'Tokyo',   utcOpenHour: 0,  utcCloseHour: 9 },
  { key: 'london',  name: 'London',  utcOpenHour: 8,  utcCloseHour: 17 },
  { key: 'newyork', name: 'New York',utcOpenHour: 13, utcCloseHour: 22 },
];

// ---- Utilities ----
function pad2(n: number) { return String(n).padStart(2, '0'); }

function formatLocalHM(d: Date, timeZone?: string, hour12?: boolean) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12, timeZone }).format(d);
}

function makeUTCDateForToday(hourUTC: number, minuteUTC = 0) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hourUTC, minuteUTC, 0));
  return d;
}

// Convert UTC hour markers to user's local string for display
function toLocalHMFromUTCHour(hourUTC: number, timeZone?: string, hour12?: boolean) {
  return formatLocalHM(makeUTCDateForToday(hourUTC), timeZone, hour12);
}

// Determine if current UTC time falls within a session window
function isOpenAtUTC(session: Session, nowUTC: Date): boolean {
  const h = nowUTC.getUTCHours();
  if (session.utcOpenHour <= session.utcCloseHour) {
    // same-day window
    return h >= session.utcOpenHour && h < session.utcCloseHour;
  }
  // wraps past midnight
  return h >= session.utcOpenHour || h < session.utcCloseHour;
}

// Determine NY weekend closure: closed from Fri 5:00 PM NY to Sun 5:00 PM NY
function isGlobalMarketClosed(now: Date): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(now);
  const day = parts.find(p => p.type === 'weekday')?.value; // Sun, Mon, ...
  const hourStr = parts.find(p => p.type === 'hour')?.value ?? '00';
  const minuteStr = parts.find(p => p.type === 'minute')?.value ?? '00';
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const isFri = day === 'Fri';
  const isSat = day === 'Sat';
  const isSun = day === 'Sun';

  if (isFri && (hour > 17 || (hour === 17 && minute >= 0))) return true;
  if (isSat) return true;
  if (isSun && (hour < 17 || (hour === 17 && minute === 0))) return true;
  return false;
}

// Build 24-hour timeline ticks based on selected timezone (labels only)
function buildTimeline(timeZone: string, hour12: boolean): { label: string }[] {
  return Array.from({ length: 24 }, (_, h) => {
    const d = makeUTCDateForToday(h);
    return { label: new Intl.DateTimeFormat(undefined, { hour: '2-digit', hour12, timeZone }).format(d) };
  });
}

// Helper: compute left % and width % for a UTC session window on a 24h scale
function getSessionBarOffsets(openUTC: number, closeUTC: number) {
  if (openUTC <= closeUTC) {
    const left = (openUTC / 24) * 100;
    const width = ((closeUTC - openUTC) / 24) * 100;
    return { left: `${left}%`, width: `${width}%` };
  }
  // wraps past midnight: render from open->24, then 0->close by merging as full width and shifting
  const left = (openUTC / 24) * 100;
  const width = ((24 - openUTC) / 24) * 100 + (closeUTC / 24) * 100;
  return { left: `${left}%`, width: `${width}%` };
}

export default function ForexMarketHourPage() {
  const [now, setNow] = useState<Date>(new Date());
  const [timeZone, setTimeZone] = useState<string>('Asia/Bangkok');
  const [hour12, setHour12] = useState<boolean>(false);
  const { t } = useI18n();

  // Auto-update every minute
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Precompute runtime data
  const runtimeSessions = useMemo(() => {
    const nowUTC = new Date(now.toISOString()); // ensure UTC getters align
    return SESSIONS.map(s => ({
      ...s,
      openLocal: toLocalHMFromUTCHour(s.utcOpenHour, timeZone, hour12),
      closeLocal: toLocalHMFromUTCHour(s.utcCloseHour, timeZone, hour12),
      isOpenNow: !isGlobalMarketClosed(now) && isOpenAtUTC(s, nowUTC),
    }));
  }, [now, timeZone, hour12]);

  const openSessions = runtimeSessions.filter(s => s.isOpenNow);
  const hasOverlap = openSessions.length > 1;
  const closedNow = isGlobalMarketClosed(now);
  const timeline = useMemo(() => buildTimeline(timeZone, hour12), [now, timeZone, hour12]);

  // For the top bubble showing current time in selected timezone
  const currentLocalTime = useMemo(() => new Intl.DateTimeFormat(undefined, { timeZone, hour: '2-digit', minute: '2-digit', weekday: 'long' , hour12 }).format(now), [now, timeZone, hour12]);
  const curUTC = now.getUTCHours();

  return (
    <div className="min-h-[80vh] rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">{t('ai.fmh.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('ai.fmh.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{t('ai.fmh.twentyfour')}</span>
          <button
            onClick={() => setHour12(h => !h)}
            className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 ${hour12 ? 'bg-slate-300' : 'bg-slate-700'}`}
            aria-label="Toggle 24h"
          >
            <span className={`absolute top-0.5 ${hour12 ? 'left-0.5' : 'left-[22px]'} h-5 w-5 rounded-full bg-white shadow`} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-500">{t('ai.fmh.time_zone')}</div>
        <select
          className="h-9 rounded-md bg-white text-slate-900 px-3 ring-1 ring-slate-300 focus:ring-2 focus:ring-slate-400 outline-none"
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
        >
          {['Asia/Bangkok','UTC','America/New_York','Europe/London','Asia/Tokyo','Australia/Sydney','Europe/Paris','Asia/Singapore'].map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        <button className="text-xs text-slate-600 hover:underline" onClick={() => setTimeZone('Asia/Bangkok')}>{t('ai.fmh.reset')}</button>
      </div>

      {/* Hour ruler with bubble marker */}
      <div className="relative mt-5">
        <div className="px-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))', gap: '0.25rem' }}>
          {timeline.map((t, i) => (
            <div key={i} className="text-[11px] text-slate-400 text-center select-none">{t.label}</div>
          ))}
        </div>
        {/* Vertical marker with bubble */}
        <div className="relative">
          <div className="absolute top-0" style={{ left: `calc((100% / 24) * ${curUTC} + (0.5 * (100% / 24)))` }}>
            <div className="-translate-x-1/2 -translate-y-2 flex flex-col items-center">
              <div className="rounded-full bg-slate-700 text-white px-3 py-1.5 shadow-md">
                <div className="text-xs font-semibold leading-none">{currentLocalTime}</div>
              </div>
              <div className="h-56 w-[2px] bg-slate-400/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Session rows container */}
      <div className="mt-5 rounded-xl border border-slate-200 p-2">
        <div className="space-y-3">
          {runtimeSessions.map((s) => (
            <SessionRow key={s.key} session={s} now={now} timeZone={timeZone} hour12={hour12} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 p-4 bg-white">
          <h3 className="text-sm font-semibold mb-2">{t('ai.fmh.session_hours')}</h3>
          <ul className="text-sm text-slate-700 space-y-1">
            {runtimeSessions.map(s => (
              <li key={s.key}>
                <span className="font-medium">{s.name}</span>: {s.openLocal} — {s.closeLocal}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 bg-white">
          <h3 className="text-sm font-semibold mb-2">{t('ai.fmh.notes')}</h3>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>{t('ai.fmh.note_1')}</li>
            <li>{t('ai.fmh.note_2')}</li>
            <li>{t('ai.fmh.note_3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---- Session Row Component ----
function SessionRow({ session, now, timeZone, hour12 }: { session: SessionRuntime; now: Date; timeZone: string; hour12: boolean }) {
  const statusOpen = session.isOpenNow;
  const statusText = statusOpen ? `${session.name.toUpperCase()} SESSION OPEN` : `${session.name.toUpperCase()} SESSION CLOSED`;
  const statusCls = statusOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600';
  const flag = session.key === 'sydney' ? '🇦🇺' : session.key === 'tokyo' ? '🇯🇵' : session.key === 'london' ? '🇬🇧' : '🇺🇸';

  const { left, width } = getSessionBarOffsets(session.utcOpenHour, session.utcCloseHour);
  const curUTC = now.getUTCHours();

  return (
    <div className="grid grid-cols-[220px_1fr] items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
      {/* Left: identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-xl">{flag}</div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{session.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded ${statusCls}`}>{statusText}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {formatLocalHM(now, timeZone, hour12)} · {session.openLocal} — {session.closeLocal}
          </div>
        </div>
      </div>

      {/* Right: timeline bar */}
      <div className="relative rounded-md bg-white border border-slate-200 h-8 overflow-hidden">
        {/* subtle stripes */}
        <div className="absolute inset-0" style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={i % 2 === 0 ? 'bg-slate-50' : ''} />
          ))}
        </div>
        {/* session active bar */}
        <div className="absolute top-1 bottom-1 rounded-md bg-slate-700/70" style={{ left, width }} />
        {/* current time marker */}
        <div className="absolute inset-y-0" style={{ left: `calc((100% / 24) * ${curUTC} + (0.5 * (100% / 24)))` }}>
          <div className="-translate-x-1/2 h-full w-[2px] bg-slate-400/80" />
        </div>
      </div>
    </div>
  );
}
