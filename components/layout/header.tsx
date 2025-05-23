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
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-metallic backdrop-blur-sm border-b border-gray-200/20" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex h-28 items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center mr-6">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-3 rounded-xl">
              <Globe className="h-7 w-7 text-white" />
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
          >
            <Search className="h-6 w-6" />
          </Button>
          
          <Button 
            className="hidden md:flex bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-metallic hover:shadow-metallic-hover transition-all duration-300 hover:bg-white/20 text-lg px-6 py-2.5"
          >
            <BarChart className="h-5 w-5 mr-2" />
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
    { title: 'Broker Reviews', href: '/brokers', split: false },
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
          className={`text-lg font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-gray-900 dark:hover:text-white relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gray-700 after:to-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap`}
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