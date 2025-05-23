"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, Globe, BarChart, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <Globe className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">ForexBrokerRatings</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" className="hidden md:flex">
            <BarChart className="h-4 w-4 mr-2" />
            Compare
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
    </header>
  );
}

function NavLinks() {
  const links = [
    { title: 'Broker Reviews', href: '/brokers' },
    { title: 'Comparison', href: '/compare' },
    { title: 'Rankings', href: '/rankings' },
    { title: 'Education', href: '/education' },
    { title: 'Blog', href: '/blog' },
  ];
  
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {link.title}
        </Link>
      ))}
    </>
  );
}

function MobileNavLinks() {
  const links = [
    { title: 'Broker Reviews', href: '/brokers', icon: <BarChart className="h-5 w-5 mr-3" /> },
    { title: 'Comparison', href: '/compare', icon: <BarChart className="h-5 w-5 mr-3" /> },
    { title: 'Rankings', href: '/rankings', icon: <List className="h-5 w-5 mr-3" /> },
    { title: 'Education', href: '/education', icon: <Globe className="h-5 w-5 mr-3" /> },
    { title: 'Blog', href: '/blog', icon: <Globe className="h-5 w-5 mr-3" /> },
  ];
  
  return (
    <>
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
      <div className="flex items-center mt-4">
        <Button className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Search Brokers
        </Button>
      </div>
    </>
  );
}