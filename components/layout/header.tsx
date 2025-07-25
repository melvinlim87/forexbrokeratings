"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, Globe, BarChart, List, X, Gift, Wrench, BookOpen, UserCircle, ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchDialog } from '@/components/search/search-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

function AuthHeaderMenu() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth?.user);
  const dispatch = useDispatch();
  const logoutUser = async () => {
      setOpen(false);
      dispatch(logout())
      window.location.href = '/';
  }

  if (loading) {
    return (
      <Button className="hidden md:flex animate-pulse bg-gradient-to-r from-cyan-400 to-purple-400 text-white font-bold border-0 shadow-lg text-lg px-6 py-2.5 ml-2 opacity-70 cursor-wait" disabled>
        Loading
      </Button>
    );
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button
          className="hidden md:flex bg-gradient-to-r from-cyan-400 to-purple-400 text-white font-bold border-0 shadow-lg hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 text-lg px-6 py-2.5 ml-2"
        >
          Login
        </Button>
      </Link>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex items-center justify-center relative h-12 w-12 border-0 focus:ring-2 focus:ring-white hover:bg-white/20"
          aria-label="User menu"
        >
          <UserCircle className="h-7 w-7 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1.5 rounded-xl shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-800 mt-2">
        <div className="flex flex-col">
          <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-base" onClick={() => setOpen(false)}>
            <User className="h-4 w-4 mr-2" /> View Profile
          </Link>
          <button
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-base"
            onClick={() => logoutUser()}
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

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
        "sticky top-0 z-[9999] w-full transition-all duration-300 bg-gray-700",
        isScrolled 
          ? "backdrop-blur-sm border-b border-gray-200/20" 
          : ""
      )}
    >
      <div className="container mx-auto px-4 flex h-24 items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center mr-6">
            {/* Header Logo */}
            <span className="inline-block ml-3">
              <Image src="/assets/images/logo/logo.png" alt="Forex Broker Ratings Logo" width={180} height={60} style={{objectFit:'cover',maxHeight:60}} priority />
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-1">
          <NavLinks />
        </nav>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <SearchDialog
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex hover:bg-white/20 dark:hover:bg-gray-800/20 h-12 w-12"
              >
                <Search className="h-6 w-6 text-white" />
              </Button>
            }
          />
          
          <Link href="/compare">
            <Button 
              className="hidden md:flex bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-metallic hover:shadow-metallic-hover transition-all duration-300 hover:bg-white/20 text-lg px-6 py-2.5"
            >
              <BarChart className="h-5 w-5 mr-2" />
              Compare
            </Button>
          </Link>
          {/* Auth UI: Show login or user dropdown */}
          <AuthHeaderMenu />
          
          {/* <ThemeToggle /> */}
          
          <Sheet>
            {/* Use ref to SheetTrigger to programmatically close the Sheet */}
            {(() => {
              const triggerRef = useRef<HTMLButtonElement>(null);
              const handleNavLinkClick = () => {
                // Trigger click on SheetTrigger to close Sheet
                triggerRef.current?.click();
              };
              return (
                <>
                  <SheetTrigger asChild>
                    <Button ref={triggerRef} variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5 text-yellow-300" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <div className="flex flex-col h-full mt-20">
                      <div className="flex justify-between items-center mb-6 mt-2">
                        <div className="flex items-center">
                          <Globe className="h-6 w-6 text-primary mr-2" />
                          <span className="text-lg font-bold">ForexBrokerRatings</span>
                        </div>
                      </div>
                      <nav className="flex flex-col space-y-6">
                        <MobileNavLinks onNavLinkClick={handleNavLinkClick} />
                      </nav>
                    </div>
                  </SheetContent>
                </>
              );
            })()}
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLinks() {
  const links = [
    { title: 'Promotions', href: '/promotions' },
    { title: 'Comparison', href: '/compare' },
    { title: 'Rankings', href: '/rankings' },
    { title: 'AI Tools', href: '/ai-tools' },
    { title: 'Blog', href: '/blog' },
  ];
  
  return (
    <>
      {links.map((link) => (
        <Link
        key={link.href}
          href={link.href} 
          className={`text-lg font-medium text-white hover:bg-white/20 dark:hover:text-white whitespace-nowrap px-8 mt-2 py-2 rounded-xl`}
        >
          {link.title}
        </Link>
      ))}
    </>
  );
}

function MobileNavLinks({ onNavLinkClick }: { onNavLinkClick: () => void }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const links = [
    { title: 'Promotions', href: '/promotions', icon: <Gift className="h-5 w-5 mr-3" /> },
    { title: 'Comparison', href: '/compare', icon: <BarChart className="h-5 w-5 mr-3" /> },
    { title: 'Rankings', href: '/rankings', icon: <List className="h-5 w-5 mr-3" /> },
    { title: 'AI Tools', href: '/ai-tools', icon: <Wrench className="h-5 w-5 mr-3" /> },
    { title: 'Blog', href: '/blog', icon: <BookOpen className="h-5 w-5 mr-3" /> },
  ];
  
  return (
    <>
      {/* Show customer profile here */}
      {!user || user.email_confirmed_at == false ? (
        <Link href="/login" className="flex items-center text-base font-medium transition-colors hover:text-white py-2 justify-center border border-black/20 rounded-xl">
          <User className="h-5 w-5 mr-3" />
          Login
        </Link>
      ) : (
        <Link href="/profile" className="flex items-center text-base font-medium transition-colors hover:text-white py-2">
          <UserCircle className="h-5 w-5 mr-3" />
          Profile
        </Link>
      )}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center text-base font-medium transition-colors hover:text-white py-2"
          onClick={onNavLinkClick}
        >
          {link.icon}
          {link.title}
        </Link>
      ))}
      <div className="flex items-center mt-4">
        <SearchDialog
          trigger={
            <Button className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search Brokers
            </Button>
          }
        />
      </div>
    </>
  );
}