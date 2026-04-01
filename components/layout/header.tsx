"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, Globe, BarChart, List, X, ChevronDown, TrendingDown, Shield, Zap, Copy, DollarSign, Monitor, Award, BookOpen, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import SearchOverlay from '@/components/layout/search-overlay';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-800/40" 
          : "bg-transparent"
      )}
    >
      {/* Trust strip — inspired by forexbrokers.com & BrokerChooser editorial transparency */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 py-1.5 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-400" />
            Independent Reviews
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3 text-amber-400" />
            50+ Brokers Tested
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-blue-400" />
            Updated March 2026
          </span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            · Trusted by 9M+ visitors
          </span>
        </div>
      </div>
      <div className="container mx-auto px-4 flex h-16 items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center mr-6">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-2.5 rounded-xl">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-transparent ml-3">
              ForexBrokerRatings
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <NavLinks />
        </nav>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex hover:bg-white/20 dark:hover:bg-gray-800/20 h-12 w-12"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-6 w-6" />
          </Button>
          
          <Button 
            className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 text-lg px-6 py-2.5"
            asChild
          >
            <Link href="/compare-tool">
              <BarChart className="h-5 w-5 mr-2" />
              Compare
            </Link>
          </Button>
          
          <ThemeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6 mt-2">
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 text-primary mr-2" />
                    <span className="text-lg font-bold">ForexBrokerRatings</span>
                  </div>
                </div>
                <nav className="flex flex-col space-y-6">
                  <MobileNavLinks />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function NavLinks() {
  const brokerCategories = [
    { title: 'Top 10 ECN Brokers', href: '/best/ecn-brokers', icon: TrendingDown, desc: 'Raw spreads & DMA' },
    { title: 'Lowest Spread Brokers', href: '/best/low-spread-brokers', icon: Zap, desc: 'Tightest EUR/USD spreads' },
    { title: 'Best for Beginners', href: '/best/beginner-brokers', icon: Shield, desc: 'Low deposit & education' },
    { title: 'ECN Brokers', href: '/category/ecn', icon: TrendingDown, desc: 'Direct market access' },
    { title: 'Low Spread', href: '/category/low-spread', icon: Zap, desc: 'Tightest EUR/USD spreads' },
    { title: 'FCA Regulated', href: '/category/fca-regulated', icon: Shield, desc: 'UK FCA licensed' },
    { title: 'MT4 Brokers', href: '/category/mt4', icon: Monitor, desc: 'MetaTrader 4 support' },
    { title: 'cTrader Brokers', href: '/category/ctrader', icon: Monitor, desc: 'cTrader platform' },
    { title: 'Copy Trading', href: '/category/copy-trading', icon: Copy, desc: 'Social trading features' },
    { title: 'No Min Deposit', href: '/category/zero-deposit', icon: DollarSign, desc: 'Start with any amount' },
    { title: 'US-Friendly', href: '/category/us-friendly', icon: Shield, desc: 'CFTC/NFA registered' },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gray-700 after:to-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap flex items-center gap-1 outline-none">
          Best Brokers <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-2">
          <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider px-2">
            Browse by Category
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-2 gap-1">
            {brokerCategories.map((cat) => (
              <DropdownMenuItem key={cat.href} asChild className="cursor-pointer p-2 rounded-lg">
                <Link href={cat.href} className="flex items-start gap-2">
                  <cat.icon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{cat.title}</div>
                    <div className="text-xs text-gray-500">{cat.desc}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/brokers" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
              <Award className="h-4 w-4" />
              View All Brokers →
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/compare"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gray-700 after:to-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
      >
        Compare
      </Link>
      <Link
        href="/rankings"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gray-700 after:to-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
      >
        Rankings
      </Link>
      <Link
        href="/ai-tools"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gray-700 after:to-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
      >
        AI Tools
      </Link>
      <Link
        href="/blog"
        className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gray-700 after:to-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
      >
        Blog
      </Link>
      <Link
        href="/methodology"
        className="text-lg font-medium text-emerald-600 dark:text-emerald-400 transition-all duration-300 hover:text-emerald-700 dark:hover:text-emerald-300 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-emerald-600 after:to-emerald-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap flex items-center gap-1"
      >
        <FlaskConical className="h-4 w-4" />
        How We Test
      </Link>
    </>
  );
}

function MobileNavLinks() {
  const brokerCategories = [
    { title: 'Top 10 ECN', href: '/best/ecn-brokers' },
    { title: 'Lowest Spread', href: '/best/low-spread-brokers' },
    { title: 'Best for Beginners', href: '/best/beginner-brokers' },
    { title: 'ECN Brokers', href: '/category/ecn' },
    { title: 'Low Spread', href: '/category/low-spread' },
    { title: 'FCA Regulated', href: '/category/fca-regulated' },
    { title: 'Copy Trading', href: '/category/copy-trading' },
    { title: 'US-Friendly', href: '/category/us-friendly' },
    { title: 'MT4 Brokers', href: '/category/mt4' },
    { title: 'cTrader', href: '/category/ctrader' },
  ];

  const links = [
    { title: 'All Brokers', href: '/brokers', icon: <Award className="h-5 w-5 mr-3" /> },
    { title: 'Compare', href: '/compare-tool', icon: <BarChart className="h-5 w-5 mr-3" /> },
    { title: 'Rankings', href: '/rankings', icon: <Award className="h-5 w-5 mr-3" /> },
    { title: 'AI Tools', href: '/ai-tools', icon: <Globe className="h-5 w-5 mr-3" /> },
    { title: 'How We Test', href: '/methodology', icon: <FlaskConical className="h-5 w-5 mr-3 text-emerald-500" /> },
    { title: 'Blog', href: '/blog', icon: <BookOpen className="h-5 w-5 mr-3" /> },
  ];
  
  return (
    <>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Best Brokers by Category</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {brokerCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center text-base font-medium transition-colors hover:text-primary py-2"
          >
            {link.icon}
            {link.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <Button className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Search Brokers
        </Button>
      </div>
    </>
  );
}