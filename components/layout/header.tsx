"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, Globe, BarChart, List, X, Gift, Wrench, BookOpen, UserCircle, ChevronDown, LogOut, User, Home, BookOpenText, MessageCircle } from 'lucide-react';
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
import { useI18n } from '@/lib/i18n-client';
import {
  Select as LangSelect,
  SelectContent as LangSelectContent,
  SelectItem as LangSelectItem,
  SelectTrigger as LangSelectTrigger,
  SelectValue as LangSelectValue,
} from '@/components/ui/select';

function AuthHeaderMenu() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth?.user);
  const dispatch = useDispatch();
  const {t} = useI18n();
  const logoutUser = async () => {
      setOpen(false);
      dispatch(logout())
      window.location.href = '/';
  }

  if (loading) {
    return (
      <Button className="hidden lg:flex animate-pulse bg-gradient-to-r from-cyan-400 to-purple-400 text-white font-bold border-0 shadow-lg text-lg px-6 py-2.5 ml-2 opacity-70 cursor-wait" disabled>
        {t('loading')}
      </Button>
    );
  }

  if (!user) {
    return (
      <Link href="/login" rel="nofollow">
        <Button
          className="hidden md:flex bg-gradient-to-r from-cyan-400 to-purple-400 text-white font-bold border-0 shadow-lg hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 text-lg px-6 py-2.5 ml-2"
        >
          {t('auth.login')}
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
      <PopoverContent align="end" className="w-44 p-1.5 rounded-xl shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-800 mt-4">
        <div className="flex flex-col">
          <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-base" onClick={() => setOpen(false)}>
            <User className="h-4 w-4 mr-2" /> {t('auth.view_profile')}
          </Link>
          <button
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-base"
            onClick={() => logoutUser()}
          >
            <LogOut className="h-4 w-4 mr-2" /> {t('auth.logout')}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { locale, setLocale, t } = useI18n();

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
      <div className="container mx-auto px-2 flex h-35 items-center">
        <div className="flex-1">
          <Link href="/" className="flex items-center">
            {/* Header Logo */}
            <span className="inline-block">
              <Image src="/assets/images/logo/logo2.png" alt="Forex Broker Ratings Logo" width={250} height={200} style={{objectFit:'cover',maxHeight:100}} priority />
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center justify-center flex-1">
          <NavLinks />
        </nav>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <SearchDialog
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex hover:bg-white/20 dark:hover:bg-gray-800/20 h-12 w-12"
              >
                <Search className="h-6 w-6 text-white" />
              </Button>
            }
          />
          
          {/* Language Selector (Desktop) */}
          <div className="hidden md:flex items-center">
            <LangSelect value={locale} onValueChange={(v: 'en' | 'zh') => setLocale(v)}>
              <LangSelectTrigger className="w-[120px] bg-white/10 text-white border-white/30">
                <LangSelectValue placeholder={t('ui.language')} />
              </LangSelectTrigger>
              <LangSelectContent>
                <LangSelectItem value="en">{t('language.english')}</LangSelectItem>
                <LangSelectItem value="zh">{t('language.chinese')}</LangSelectItem>
              </LangSelectContent>
            </LangSelect>
          </div>
          
          <Link href="/">
            <Button 
              className="hidden lg:flex bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-metallic hover:shadow-metallic-hover transition-all duration-300 hover:bg-white/20 text-lg px-6 py-2.5"
            >
              <Home className="h-5 w-5 mr-2" />
              {t('nav.home')}
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
                    <Button ref={triggerRef} variant="ghost" size="icon" className="lg:hidden">
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
  const { t } = useI18n();
  const links = [
    { title: 'nav.promotions', href: '/promotions' },
    { title: 'nav.rankings', href: '/rankings' },
    { title: 'nav.profiles', href: '/#featured-brokers' },
    { title: 'nav.reviews', href: '/#latest-reviews' },
    { title: 'nav.comparison', href: '/compare' },
    { title: 'nav.ai_tools', href: '/ai-tools' },
    { title: 'nav.blog', href: '/blog' },
  ];
  
  return (
    <>
      {links.map((link) => (
        link.title === 'nav.ai_tools' ? (
          <AiToolsDropdown key="ai-tools" />
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xl font-medium text-white hover:bg-white/20 dark:hover:text-white whitespace-nowrap px-4 mt-2 py-2 rounded-xl`}
          >
            {t(link.title)}
          </Link>
        )
      ))}
    </>
  );
}

function AiToolsDropdown() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-xl font-medium text-white whitespace-nowrap px-4 mt-2 py-2 rounded-xl hover:bg-white/20"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span>{t('nav.ai_tools')}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2 rounded-xl shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-800 mt-4">
        <div className="flex flex-col">
          <Link href="/ai-tools#popular" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100" onClick={() => setOpen(false)}>{t('ai.popular')}</Link>
          <Link href="/ai-tools#products" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100" onClick={() => setOpen(false)}>{t('ai.products')}</Link>
          <Link href="/ai-tools#all" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100" onClick={() => setOpen(false)}>{t('ai.all')}</Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileNavLinks({ onNavLinkClick }: { onNavLinkClick: () => void }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const { t, locale, setLocale } = useI18n();
  const links = [
    { title: 'nav.promotions', href: '/promotions', icon: <Gift className="h-5 w-5 mr-3" /> },
    { title: 'nav.rankings', href: '/rankings', icon: <List className="h-5 w-5 mr-3" /> },
    { title: 'nav.profiles', href: '/#featured-brokers', icon: <BookOpenText className="h-5 w-5 mr-3" /> },
    { title: 'nav.reviews', href: '/#latest-reviews', icon: <MessageCircle className="h-5 w-5 mr-3" /> },
    { title: 'nav.comparison', href: '/compare', icon: <BarChart className="h-5 w-5 mr-3" /> },
    { title: 'nav.ai_tools', href: '/ai-tools', icon: <Wrench className="h-5 w-5 mr-3" /> },
    { title: 'nav.blog', href: '/blog', icon: <BookOpen className="h-5 w-5 mr-3" /> },
  ];
  
  return (
    <>
      {/* Show customer profile here */}
      {!user || user.email_confirmed_at == false ? (
        <Link href="/login" className="flex items-center text-base font-medium transition-colors hover:text-white py-2 justify-center border border-black/20 rounded-xl">
          <User className="h-5 w-5 mr-3" />
          {t('auth.login')}
        </Link>
      ) : (
        <Link href="/profile" className="flex items-center text-base font-medium transition-colors hover:text-white py-2">
          <UserCircle className="h-5 w-5 mr-3" />
          {t('auth.profile')}
        </Link>
      )}
      {links.map((link) => (
        link.title === 'nav.ai_tools' ? (
          <MobileAiTools key="ai-tools-mobile" onNavLinkClick={onNavLinkClick} />
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center text-base font-medium transition-colors hover:text-white py-2"
            onClick={onNavLinkClick}
          >
            {link.icon}
            {t(link.title)}
          </Link>
        )
      ))}
      {/* Mobile language selector */}
      <div className="flex items-center gap-2 mt-4">
        <LangSelect value={locale} onValueChange={(v: 'en' | 'zh') => setLocale(v)}>
          <LangSelectTrigger className="w-full">
            <LangSelectValue placeholder={t('ui.language')} />
          </LangSelectTrigger>
          <LangSelectContent>
            <LangSelectItem value="en">{t('language.english')}</LangSelectItem>
            <LangSelectItem value="zh">{t('language.chinese')}</LangSelectItem>
          </LangSelectContent>
        </LangSelect>
      </div>
    </>
  );
}

function MobileAiTools({ onNavLinkClick }: { onNavLinkClick: () => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        className="flex items-center justify-between text-base font-medium transition-colors hover:text-white py-2"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex items-center"><Wrench className="h-5 w-5 mr-3" /> {t('nav.ai_tools')}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-8 mt-1 flex flex-col gap-1">
          <Link href="/ai-tools#popular" className="py-1 text-sm" onClick={onNavLinkClick}>{t('ai.popular')}</Link>
          <Link href="/ai-tools#products" className="py-1 text-sm" onClick={onNavLinkClick}>{t('ai.products')}</Link>
          <Link href="/ai-tools#all" className="py-1 text-sm" onClick={onNavLinkClick}>{t('ai.all')}</Link>
        </div>
      )}
    </div>
  );
}