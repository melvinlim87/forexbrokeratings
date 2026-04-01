'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Star, ExternalLink, Search, SlidersHorizontal, ChevronDown, MapPin, TrendingUp, Users, Globe2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// ─── Broker Data ────────────────────────────────────────────────────────────────
interface Broker {
  rank: number;
  name: string;
  website: string;
  logo: string;
  masRegulated: boolean;
  otherRegs: string[];
  sgdAccount: boolean;
  spreads: string;
  minDeposit: string;
  minDepositNum: number;
  platforms: string[];
  rating: number;
  pros: string;
}

const brokers: Broker[] = [
  { rank: 1, name: 'Pepperstone', website: 'https://www.pepperstone.com', logo: '/logos/pepperstone.png', masRegulated: false, otherRegs: ['ASIC', 'FCA', 'BaFin', 'CySEC', 'DFSA'], sgdAccount: true, spreads: '0.0 pips (Razor)', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'], rating: 9.8, pros: 'Tightest spreads in Singapore (0.0 pips Razor), fastest execution (77ms), 5 trading platforms, 94 forex pairs. Top choice for scalpers and day traders.' },
  { rank: 2, name: 'Eightcap', website: 'https://www.eightcap.com', logo: '/logos/eightcap.png', masRegulated: false, otherRegs: ['ASIC', 'FCA', 'CySEC'], sgdAccount: false, spreads: '0.06 pips (RAW)', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5', 'TradingView'], rating: 9.6, pros: 'Largest crypto CFD range (141+), lowest RAW spreads (0.06 pips EUR/USD), 400+ instruments, TradingView integration.' },
  { rank: 3, name: 'Interactive Brokers', website: 'https://www.interactivebrokers.com', logo: '/logos/interactivebrokers.png', masRegulated: true, otherRegs: ['NFA/CFTC', 'ASIC', 'FCA', 'CIRO', 'JFSA'], sgdAccount: true, spreads: 'From 0.1 pips', minDeposit: '$0', minDepositNum: 0, platforms: ['IBKR Workstation', 'IBKR Global Trader', 'IBKR Mobile'], rating: 8.8, pros: 'True ECN broker, NASDAQ-listed, lowest commissions ($1/side for pros), 70,000+ markets, best for professional traders.' },
  { rank: 4, name: 'IG Group', website: 'https://www.ig.com', logo: '/logos/ig.png', masRegulated: true, otherRegs: ['ASIC', 'FCA', 'FMA'], sgdAccount: true, spreads: '0.16 pips (RAW)', minDeposit: '$0', minDepositNum: 0, platforms: ['IG Platform', 'MT4', 'TradingView', 'ProRealTime'], rating: 7.7, pros: 'Largest product range (17,000+ markets), MAS regulated, established brand since 1974, excellent educational resources.' },
  { rank: 5, name: 'City Index', website: 'https://www.cityindex.com', logo: '/logos/cityindex.png', masRegulated: true, otherRegs: ['ASIC', 'FCA'], sgdAccount: false, spreads: '0.70 pips (Standard)', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'TradingView', 'WebTrader'], rating: 7.3, pros: 'MAS regulated, lowest standard account spreads (0.70 pips EUR/USD), Performance Analytics coaching tool, 5,000+ products.' },
  { rank: 6, name: 'Saxo Bank', website: 'https://www.saxomarkets.com.sg', logo: '/logos/saxomarkets.png', masRegulated: true, otherRegs: ['FCA', 'FINMA', 'ASIC', 'BaFin'], sgdAccount: true, spreads: '1.1 pips (Standard)', minDeposit: '$2,000', minDepositNum: 2000, platforms: ['SaxoTraderGO', 'SaxoTraderPRO', 'TradingView'], rating: 5.5, pros: 'MAS regulated Danish bank, premium platform with 64+ indicators, 8,800+ markets, professional analyst research.' },
  { rank: 7, name: 'Plus500', website: 'https://www.plus500.com', logo: '/logos/plus500.png', masRegulated: true, otherRegs: ['ASIC', 'CySEC', 'FCA', 'DFSA', 'FMA'], sgdAccount: true, spreads: '0.8 pips (Standard)', minDeposit: '$100', minDepositNum: 100, platforms: ['Plus500 WebTrader', 'Plus500 Mobile'], rating: 7.5, pros: 'MAS regulated, award-winning mobile app, negative balance protection, guaranteed stop loss, user-friendly for beginners.' },
  { rank: 8, name: 'CMC Markets', website: 'https://www.cmcmarkets.com.sg', logo: '/logos/cmcmarkets.png', masRegulated: true, otherRegs: ['ASIC', 'FCA', 'BaFin', 'CIRO', 'FMA'], sgdAccount: false, spreads: '0.50 pips (RAW)', minDeposit: '$200', minDepositNum: 200, platforms: ['MT4', 'CMC NGEN'], rating: 6.8, pros: 'MAS regulated, largest currency pair selection (283 pairs), CMC NGEN platform with pattern recognition, 12,000+ markets.' },
  { rank: 9, name: 'OANDA', website: 'https://www.oanda.com', logo: '/logos/oanda.png', masRegulated: true, otherRegs: ['NFA/CFTC', 'FCA', 'ASIC', 'IIROC'], sgdAccount: true, spreads: 'From 1.1 pips', minDeposit: '$0', minDepositNum: 0, platforms: ['OANDA Trade', 'MT4', 'TradingView'], rating: 8.2, pros: 'Established forex specialist since 1996, strong Asia presence, excellent for corporate FX, transparent pricing.' },
  { rank: 10, name: 'IC Markets', website: 'https://www.icmarkets.com', logo: '/logos/icmarkets.png', masRegulated: false, otherRegs: ['ASIC', 'CySEC', 'FSA', 'SCB'], sgdAccount: true, spreads: '0.02 pips (RAW)', minDeposit: '$200', minDepositNum: 200, platforms: ['MT4', 'MT5', 'cTrader'], rating: 8.5, pros: "World's largest forex broker by volume, ultra-low spreads (0.02 pips RAW), ECN execution, popular with algo traders." },
  { rank: 11, name: 'Go Markets', website: 'https://www.gomarkets.com', logo: '/logos/gomarkets.png', masRegulated: false, otherRegs: ['ASIC', 'CySEC', 'FSC', 'FSA'], sgdAccount: true, spreads: '0.10 pips (RAW)', minDeposit: '$200', minDepositNum: 200, platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'], rating: 7.8, pros: 'Lowest commission RAW account ($2.50/lot), SGD base currency, Genesis upgrade for MT4, social trading via Myfxbook.' },
  { rank: 12, name: 'Fusion Markets', website: 'https://www.fusionmarkets.com', logo: '/logos/fusionmarkets.png', masRegulated: false, otherRegs: ['ASIC', 'VFSC'], sgdAccount: false, spreads: '0.16 pips (RAW)', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'], rating: 8.0, pros: 'Cheapest commissions ($2.25/lot), zero-pip spreads, Australian-regulated, popular with cost-conscious SG traders.' },
  { rank: 13, name: 'FP Markets', website: 'https://www.fpmarkets.com', logo: '/logos/fpmarkets.png', masRegulated: false, otherRegs: ['ASIC', 'CySEC'], sgdAccount: false, spreads: '0.09 pips (RAW)', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5', 'Iress', 'TradingView'], rating: 8.3, pros: 'Australian regulated, low spreads from 0.0 pips, 10,000+ instruments, Iress platform for stocks.' },
  { rank: 14, name: 'XM', website: 'https://www.xm.com', logo: '/logos/xm.png', masRegulated: false, otherRegs: ['CySEC', 'ASIC', 'IFSC'], sgdAccount: false, spreads: 'From 0.1 pips', minDeposit: '$5', minDepositNum: 5, platforms: ['MT4', 'MT5'], rating: 7.5, pros: 'Extremely popular in Asia, $0 minimum deposit, extensive educational webinars, 1,000+ instruments.' },
  { rank: 15, name: 'Tickmill', website: 'https://www.tickmill.com', logo: '/logos/tickmill.png', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'FSA', 'DFSA'], sgdAccount: false, spreads: '0.0 pips (RAW)', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5', 'TradingView'], rating: 8.2, pros: 'Ultra-low spreads (0.0 pips RAW), $2.00 commission/lot, FCA regulated, fast execution, swap-free accounts.' },
  { rank: 16, name: 'HFM (HotForex)', website: 'https://www.hfm.com', logo: 'https://www.google.com/s2/favicons?domain=hfm.com&sz=128', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'FSCA', 'FSA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'MT5', 'HFM Platform'], rating: 7.8, pros: 'Multi-asset broker, extensive account types (7 options), copy trading, zero deposits on some accounts.' },
  { rank: 17, name: 'eToro', website: 'https://www.etoro.com', logo: '/logos/etoro.png', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'ASIC', 'FinCEN'], sgdAccount: false, spreads: 'From 1.0 pip', minDeposit: '$50', minDepositNum: 50, platforms: ['eToro WebTrader', 'eToro Mobile'], rating: 7.2, pros: '#1 social/copy trading platform, 30M+ users, beginner-friendly, multi-asset (stocks, crypto, forex).' },
  { rank: 18, name: 'FXTM (ForexTime)', website: 'https://www.fxtm.com', logo: 'https://www.google.com/s2/favicons?domain=fxtm.com&sz=128', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'FSCA', 'FSA'], sgdAccount: false, spreads: 'From 0.1 pips', minDeposit: '$10', minDepositNum: 10, platforms: ['MT4', 'MT5', 'FXTM Trader'], rating: 7.0, pros: 'Popular in Asia, low spreads, extensive educational content, cent accounts for beginners.' },
  { rank: 19, name: 'Axi', website: 'https://www.axi.com', logo: 'https://www.google.com/s2/favicons?domain=axi.com&sz=128', masRegulated: false, otherRegs: ['ASIC', 'FCA', 'DFSA', 'FMA'], sgdAccount: false, spreads: 'From 0.40 pips', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'Axi Platform'], rating: 7.5, pros: 'Australian regulated, excellent for algo trading, MT4 NextGen features, copy trading via Axi Copy Trading.' },
  { rank: 20, name: 'TMGM', website: 'https://www.tmgm.com', logo: 'https://www.google.com/s2/favicons?domain=tmgm.com&sz=128', masRegulated: false, otherRegs: ['ASIC', 'VFSC'], sgdAccount: false, spreads: '0.15 pips (RAW)', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5', 'TMGM Platform'], rating: 7.0, pros: 'ASIC regulated, ultra-low spreads (0.15 pips), 15,000+ instruments, strong Asian marketing.' },
  { rank: 21, name: 'ThinkMarkets', website: 'https://www.thinkmarkets.com', logo: '/logos/thinkmarkets.png', masRegulated: false, otherRegs: ['ASIC', 'FCA', 'FSCA', 'JFSA'], sgdAccount: false, spreads: 'From 0.22 pips', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'MT5', 'ThinkTrader'], rating: 7.8, pros: 'Multi-regulated, ThinkTrader platform with 80+ indicators, forex & CFD expertise, institutional-grade execution.' },
  { rank: 22, name: 'Octa', website: 'https://www.octa.com', logo: 'https://www.google.com/s2/favicons?domain=octa.com&sz=128', masRegulated: false, otherRegs: ['CySEC', 'FCA'], sgdAccount: false, spreads: 'From 0.6 pips', minDeposit: '$25', minDepositNum: 25, platforms: ['MT4', 'MT5', 'OctaTrader'], rating: 7.5, pros: 'Extremely popular in Southeast Asia, copy trading, zero-spread accounts, fast execution (81ms).' },
  { rank: 23, name: 'RoboForex', website: 'https://www.roboforex.com', logo: '/logos/roboforex.png', masRegulated: false, otherRegs: ['IFSC', 'CySEC'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$10', minDepositNum: 10, platforms: ['MT4', 'MT5', 'R WebTrader'], rating: 6.5, pros: 'Low commissions ($2.00/lot), copy trading (CopyFX), cent accounts, bonus programs, wide platform selection.' },
  { rank: 24, name: 'Exness', website: 'https://www.exness.com', logo: '/logos/exness.png', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'FSA', 'FSCA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$1', minDepositNum: 1, platforms: ['MT4', 'MT5', 'Exness Trader'], rating: 7.8, pros: 'One of the largest forex brokers globally, instant withdrawals, extremely high leverage available.' },
  { rank: 25, name: 'AvaTrade', website: 'https://www.avatrade.com', logo: '/logos/avatrade.png', masRegulated: false, otherRegs: ['ASIC', 'FCA', 'CySEC', 'CBI', 'FSA'], sgdAccount: false, spreads: 'From 0.9 pips', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5', 'AvaTrade Web', 'AvaSocial'], rating: 7.2, pros: 'Well-regulated (6 jurisdictions), AvaSocial copy trading, fixed spreads option, strong educational resources.' },
  { rank: 26, name: 'Admirals', website: 'https://www.admirals.com', logo: 'https://www.google.com/s2/favicons?domain=admirals.com&sz=128', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'ASIC'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5', 'Admirals Platform'], rating: 7.0, pros: 'Well-regulated European broker, MetaTrader Supreme Edition, Admiral Invest for stocks.' },
  { rank: 27, name: 'FXCM', website: 'https://www.fxcm.com', logo: 'https://www.google.com/s2/favicons?domain=fxcm.com&sz=128', masRegulated: false, otherRegs: ['FCA', 'ASIC'], sgdAccount: false, spreads: 'From 0.6 pips', minDeposit: '$50', minDepositNum: 50, platforms: ['MT4', 'Trading Station', 'NinjaTrader'], rating: 6.8, pros: 'Long-standing broker (founded 1999), Trading Station platform, no dealing desk, strong in Asia-Pacific.' },
  { rank: 28, name: 'Blueberry Markets', website: 'https://www.blueberrymarkets.com', logo: 'https://www.google.com/s2/favicons?domain=blueberrymarkets.com&sz=128', masRegulated: false, otherRegs: ['ASIC', 'FSCA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5'], rating: 6.8, pros: 'Australian regulated, competitive RAW spreads, good customer support, popular with SG scalpers.' },
  { rank: 29, name: 'BlackBull Markets', website: 'https://www.blackbullmarkets.com', logo: '/logos/blackbullmarkets.png', masRegulated: false, otherRegs: ['FCA', 'FMA', 'FSA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'MT5', 'cTrader'], rating: 6.5, pros: 'ECN broker, fast execution, institutional-grade liquidity, good for copy trading.' },
  { rank: 30, name: 'PU Prime', website: 'https://www.puprime.com', logo: 'https://www.google.com/s2/favicons?domain=puprime.com&sz=128', masRegulated: false, otherRegs: ['FSA', 'SCB'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$50', minDepositNum: 50, platforms: ['MT4', 'MT5'], rating: 6.0, pros: 'Fast-growing broker, low spreads, copy trading, strong Asian client support.' },
  { rank: 31, name: 'DEGIRO', website: 'https://www.degiro.com.sg', logo: 'https://www.google.com/s2/favicons?domain=degiro.com&sz=128', masRegulated: true, otherRegs: ['BaFin', 'AFM'], sgdAccount: false, spreads: 'N/A (Stock broker)', minDeposit: '$0', minDepositNum: 0, platforms: ['DEGIRO WebTrader', 'DEGIRO App'], rating: 6.5, pros: 'MAS regulated, low-cost stock/ETF trading, ideal for investors not active forex traders.' },
  { rank: 32, name: 'DBS Vickers', website: 'https://www.dbsvickers.com', logo: 'https://www.google.com/s2/favicons?domain=dbsvickers.com&sz=128', masRegulated: true, otherRegs: ['MAS'], sgdAccount: true, spreads: '1.50+ pips', minDeposit: 'Varies', minDepositNum: 500, platforms: ['DBS Vickers Online', 'DBS Vickers Mobile'], rating: 5.5, pros: "Singapore's largest bank subsidiary, MAS regulated, trusted local brand, ideal for SG investors." },
  { rank: 33, name: 'Phillip Securities', website: 'https://www.phillipnova.com.sg', logo: 'https://www.google.com/s2/favicons?domain=phillipnova.com.sg&sz=128', masRegulated: true, otherRegs: ['MAS', 'FCA', 'ASIC'], sgdAccount: true, spreads: 'From 1.5 pips', minDeposit: '$1,000', minDepositNum: 1000, platforms: ['POEMS', 'MT4', 'TradingView'], rating: 6.0, pros: 'MAS regulated, established Singapore broker (PhillipCapital), local market expertise, SGX member.' },
  { rank: 34, name: 'UOB Kay Hian', website: 'https://www.uobkayhian.com', logo: 'https://www.google.com/s2/favicons?domain=uobkayhian.com&sz=128', masRegulated: true, otherRegs: ['MAS'], sgdAccount: true, spreads: 'N/A (Stock broker)', minDeposit: 'Varies', minDepositNum: 500, platforms: ['UTRADE'], rating: 5.5, pros: 'MAS regulated, major SG brokerage (UOB subsidiary), SGX member, trusted by local clients.' },
  { rank: 35, name: 'OCBC Securities', website: 'https://www.ocbcsecurities.com', logo: 'https://www.google.com/s2/favicons?domain=ocbcsecurities.com&sz=128', masRegulated: true, otherRegs: ['MAS'], sgdAccount: true, spreads: 'N/A (Stock broker)', minDeposit: 'Varies', minDepositNum: 500, platforms: ['OCBC Securities Online'], rating: 5.0, pros: 'MAS regulated, OCBC Bank subsidiary, local banking integration, trusted Singapore brand.' },
  { rank: 36, name: 'Maybank Securities', website: 'https://www.maybankke.com.sg', logo: 'https://www.google.com/s2/favicons?domain=maybankke.com.sg&sz=128', masRegulated: true, otherRegs: ['MAS', 'SC Malaysia'], sgdAccount: true, spreads: 'Variable', minDeposit: 'Varies', minDepositNum: 500, platforms: ['Maybank Online Trading'], rating: 5.0, pros: 'MAS regulated, Maybank subsidiary, strong in ASEAN markets, cross-border connectivity.' },
  { rank: 37, name: 'CGS-CIMB Securities', website: 'https://www.cgsinternational.com.sg', logo: 'https://www.google.com/s2/favicons?domain=cgsinternational.com.sg&sz=128', masRegulated: true, otherRegs: ['MAS', 'SC Malaysia'], sgdAccount: true, spreads: 'Variable', minDeposit: 'Varies', minDepositNum: 500, platforms: ['iTRADE'], rating: 5.5, pros: 'MAS regulated, Singapore-Malaysia joint venture, SGX member, ASEAN coverage.' },
  { rank: 38, name: 'Tiger Brokers', website: 'https://www.tigerbrokers.com.sg', logo: 'https://www.google.com/s2/favicons?domain=tigerbrokers.com&sz=128', masRegulated: true, otherRegs: ['MAS', 'SEC US'], sgdAccount: true, spreads: 'N/A (Stock broker)', minDeposit: '$0', minDepositNum: 0, platforms: ['Tiger Trade App', 'Web'], rating: 6.5, pros: 'MAS regulated, modern mobile-first platform, popular with SG millennials, US + SG stock trading.' },
  { rank: 39, name: 'moomoo (Futu)', website: 'https://www.moomoo.com.sg', logo: 'https://www.google.com/s2/favicons?domain=moomoo.com&sz=128', masRegulated: true, otherRegs: ['MAS', 'SEC US', 'SFC HK'], sgdAccount: true, spreads: 'N/A (Stock broker)', minDeposit: '$0', minDepositNum: 0, platforms: ['moomoo App', 'Desktop'], rating: 6.5, pros: 'MAS regulated, backed by Tencent, modern interface, US + SG stocks, good charts.' },
  { rank: 40, name: 'Tickmill (Pro)', website: 'https://www.tickmill.com', logo: '/logos/tickmill.png', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'FSA', 'DFSA'], sgdAccount: false, spreads: '0.0 pips (Pro)', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5'], rating: 7.0, pros: 'Professional account with ultra-low spreads and commissions, ideal for experienced SG traders.' },
  { rank: 41, name: 'Vantage', website: 'https://www.vantagefx.com', logo: 'https://www.google.com/s2/favicons?domain=vantagefx.com&sz=128', masRegulated: false, otherRegs: ['ASIC', 'CIMA', 'FCA', 'FSCA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$50', minDepositNum: 50, platforms: ['MT4', 'MT5', 'Vantage App', 'TradingView'], rating: 7.2, pros: 'Australian regulated, Vantage Copy Trading, ECN execution, 300+ instruments.' },
  { rank: 42, name: 'InstaForex', website: 'https://www.instaforex.com', logo: 'https://www.google.com/s2/favicons?domain=instaforex.com&sz=128', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'FSA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$1', minDepositNum: 1, platforms: ['MT4', 'MT5'], rating: 5.5, pros: 'Popular in Asia, extensive bonus programs, 300+ forex pairs, PAMM accounts for fund management.' },
  { rank: 43, name: 'LiteFinance', website: 'https://www.litefinance.com', logo: 'https://www.google.com/s2/favicons?domain=litefinance.com&sz=128', masRegulated: false, otherRegs: ['CySEC', 'FSA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$50', minDepositNum: 50, platforms: ['MT4', 'MT5', 'LiteFinance App'], rating: 5.5, pros: 'High leverage (up to 1:500), copy trading, cent accounts, popular in Asian markets.' },
  { rank: 44, name: 'NordFX', website: 'https://www.nordfx.com', logo: 'https://www.google.com/s2/favicons?domain=nordfx.com&sz=128', masRegulated: false, otherRegs: ['FSC', 'VFSC'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$5', minDepositNum: 5, platforms: ['MT4', 'MT5'], rating: 5.0, pros: 'Multi-account types, low spreads, copy trading (Fix Accounts), popular in Asia.' },
  { rank: 45, name: 'Forex.com', website: 'https://www.forex.com', logo: '/logos/forex.png', masRegulated: false, otherRegs: ['NFA/CFTC', 'FCA', 'ASIC', 'CIRO'], sgdAccount: false, spreads: 'From 0.8 pips', minDeposit: '$100', minDepositNum: 100, platforms: ['Forex.com Platform', 'MT4', 'MT5', 'TradingView'], rating: 7.0, pros: 'Well-known global brand (StoneX), NFA regulated, Advanced Trading Platform, strong research tools.' },
  { rank: 46, name: 'Axiory', website: 'https://www.axiory.com', logo: 'https://www.google.com/s2/favicons?domain=axiory.com&sz=128', masRegulated: false, otherRegs: ['IFSC', 'FSC', 'FSA'], sgdAccount: false, spreads: 'From 0.2 pips', minDeposit: '$10', minDepositNum: 10, platforms: ['MT4', 'MT5', 'cTrader'], rating: 6.0, pros: 'Low spreads, fast execution, NDD/STP model, educational resources, good customer support.' },
  { rank: 47, name: 'Infinox', website: 'https://www.infinox.com', logo: 'https://www.google.com/s2/favicons?domain=infinox.com&sz=128', masRegulated: false, otherRegs: ['FCA', 'SCB', 'FSCA'], sgdAccount: false, spreads: 'From 0.2 pips', minDeposit: '$0', minDepositNum: 0, platforms: ['MT4', 'MT5', 'IX Social'], rating: 6.2, pros: 'UK FCA regulated, IX Social copy trading, good execution, competitive spreads.' },
  { rank: 48, name: 'Monex (TradeView)', website: 'https://www.tradeviewforex.com', logo: 'https://www.google.com/s2/favicons?domain=tradeviewforex.com&sz=128', masRegulated: false, otherRegs: ['JFSA', 'ASIC'], sgdAccount: false, spreads: 'Variable', minDeposit: '$50', minDepositNum: 50, platforms: ['MT4', 'MT5', 'Monex Trader'], rating: 6.0, pros: 'Japanese regulated broker, strong Asian presence, reliable execution, institutional-grade.' },
  { rank: 49, name: 'IronFX', website: 'https://www.ironfx.com', logo: '/logos/ironfx.png', masRegulated: false, otherRegs: ['FCA', 'CySEC', 'ASIC', 'FSCA'], sgdAccount: false, spreads: 'From 0.0 pips', minDeposit: '$100', minDepositNum: 100, platforms: ['MT4', 'MT5', 'IronFX Platform'], rating: 5.8, pros: 'Multi-regulated, 10 account types, copy trading (IronFX Social), extensive educational content.' },
  { rank: 50, name: 'easyMarkets', website: 'https://www.easymarkets.com', logo: '/logos/easymarkets.png', masRegulated: false, otherRegs: ['ASIC', 'CySEC', 'FSA'], sgdAccount: false, spreads: 'From 0.7 pips', minDeposit: '$25', minDepositNum: 25, platforms: ['easyMarkets Web', 'MT4', 'MT5', 'TradingView'], rating: 6.0, pros: 'Fixed spreads option, guaranteed stop loss, dealCancellation feature, simple platform, beginner-friendly.' },
];

// ─── Sorting & Filtering ────────────────────────────────────────────────────────
type SortKey = 'rank' | 'rating' | 'minDeposit' | 'mas';
type FilterKey = 'all' | 'mas' | 'international';

export default function SingaporePage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('rank');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBrokers = useMemo(() => {
    let result = [...brokers];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.name.toLowerCase().includes(q) || b.pros.toLowerCase().includes(q));
    }

    // Filter
    if (filter === 'mas') result = result.filter(b => b.masRegulated);
    if (filter === 'international') result = result.filter(b => !b.masRegulated);

    // Sort
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'minDeposit') result.sort((a, b) => a.minDepositNum - b.minDepositNum);
    else if (sortBy === 'mas') result.sort((a, b) => (b.masRegulated ? 1 : 0) - (a.masRegulated ? 1 : 0));
    else result.sort((a, b) => a.rank - b.rank);

    return result;
  }, [search, sortBy, filter]);

  const masCount = brokers.filter(b => b.masRegulated).length;
  const sgdCount = brokers.filter(b => b.sgdAccount).length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-xl">🇸🇬</span>
              <span className="text-gray-700 dark:text-white/90 text-sm font-medium">Singapore Market Guide 2026</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              Top 50 Forex Brokers in Singapore
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-white/70 mb-8 max-w-2xl mx-auto">
              Comprehensive guide to the best forex brokers available to Singapore traders. {masCount} MAS licensed brokers included.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { icon: <Globe2 className="h-4 w-4" />, label: 'Total Brokers', value: '50' },
                { icon: <Shield className="h-4 w-4" />, label: 'MAS Licensed', value: `${masCount}` },
                { icon: <TrendingUp className="h-4 w-4" />, label: 'SGD Accounts', value: `${sgdCount}` },
                { icon: <Users className="h-4 w-4" />, label: 'Avg Rating', value: (brokers.reduce((a, b) => a + b.rating, 0) / brokers.length).toFixed(1) },
              ].map((s, i) => (
                <div key={i} className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-200/30 dark:border-white/10">
                  <div className="flex justify-center text-gray-500 dark:text-white/60 mb-1">{s.icon}</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose dark:prose-invert">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Singapore Forex Market Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Singapore is Asia&apos;s leading forex hub with average daily turnover exceeding <strong>$600 billion SGD</strong>. 
              The <strong>Monetary Authority of Singapore (MAS)</strong> regulates all financial services, capping retail leverage at 
              <strong> 30:1</strong> for major pairs and <strong>20:1</strong> for minors. There is <strong>no capital gains tax</strong> on forex 
              trading profits in Singapore, making it an attractive market for traders.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We&apos;ve compiled this comprehensive list of 50 forex brokers available to Singapore residents, including {masCount} brokers 
              that hold MAS Capital Markets Services (CMS) licenses. MAS-regulated brokers offer the highest level of trust and protection 
              for Singapore traders.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 sticky top-20 z-30 border-b border-gray-200/30 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search brokers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm text-gray-900 dark:text-white"
              >
                <option value="rank">Sort: Ranking</option>
                <option value="rating">Sort: Rating</option>
                <option value="minDeposit">Sort: Min Deposit</option>
                <option value="mas">Sort: MAS First</option>
              </select>
              <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                {(['all', 'mas', 'international'] as FilterKey[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 text-xs font-medium transition-colors ${
                      filter === f 
                        ? 'bg-[#ED2939] text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'mas' ? 'MAS Licensed' : 'International'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredBrokers.length} of {brokers.length} brokers
          </div>
        </div>
      </section>

      {/* Broker List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {filteredBrokers.map((broker, i) => (
              <motion.div
                key={broker.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Left: Rank + Logo */}
                      <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                          broker.rank <= 3 
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                            : broker.rank <= 10 
                              ? 'bg-gradient-to-br from-gray-500 to-gray-700' 
                              : 'bg-gradient-to-br from-gray-400 to-gray-600'
                        }`}>
                          {broker.rank}
                        </div>
                        <div className="h-10 w-24 relative bg-gray-50 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          <Image src={broker.logo} alt={broker.name} fill className="object-contain p-1" unoptimized />
                        </div>
                      </div>

                      {/* Center: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{broker.name}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge 
                                variant={broker.masRegulated ? 'default' : 'secondary'} 
                                className={broker.masRegulated 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                }
                              >
                                {broker.masRegulated ? (
                                  <><CheckCircle2 className="h-3 w-3 mr-1" />MAS Licensed</>
                                ) : (
                                  <><Globe2 className="h-3 w-3 mr-1" />International</>
                                )}
                              </Badge>
                              {broker.sgdAccount && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                  SGD Account
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 rounded px-2 py-1 flex-shrink-0">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{broker.rating}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{broker.pros}</p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Spreads</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{broker.spreads}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Min Deposit</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{broker.minDeposit}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Platforms</div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{broker.platforms.slice(0, 3).join(', ')}{broker.platforms.length > 3 ? '...' : ''}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Regulation</div>
                            <div className="flex flex-wrap gap-1">
                              {broker.otherRegs.slice(0, 3).map(r => (
                                <span key={r} className="text-[10px] font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                  {r}
                                </span>
                              ))}
                              {broker.otherRegs.length > 3 && (
                                <span className="text-[10px] text-gray-400">+{broker.otherRegs.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: CTA */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 md:w-36 flex-shrink-0">
                        <a href={broker.website} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full bg-gradient-to-r from-[#ED2939] to-[#C62828] hover:from-[#C62828] hover:to-[#8B0000] text-white shadow-md hover:shadow-lg transition-all">
                            Visit Broker
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </a>
                        <Link href={`/broker/${broker.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Full Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MAS Info Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">MAS Licensed Brokers in Singapore</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {brokers.filter(b => b.masRegulated).map(broker => (
                <Card key={broker.rank} className="p-4 flex items-center gap-3">
                  <div className="h-8 w-16 relative bg-gray-50 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <Image src={broker.logo} alt={broker.name} fill className="object-contain p-1" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{broker.name}</div>
                    <div className="text-xs text-gray-500">Rank #{broker.rank} • Rating {broker.rating}/10</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex-shrink-0 text-[10px]">
                    <CheckCircle2 className="h-3 w-3 mr-0.5" />MAS
                  </Badge>
                </Card>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">⚠️ Risk Disclaimer</h3>
              <p className="text-sm text-amber-700 dark:text-amber-500">
                Trading forex and CFDs carries a high level of risk and may not be suitable for all investors. 
                You could lose more than your initial deposit. MAS caps retail leverage at 30:1 for major currency pairs 
                and 20:1 for non-major pairs. Always ensure you fully understand the risks involved. Past performance 
                is not indicative of future results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
