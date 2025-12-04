'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchEconomicCalendarByDateRange, type EconomicCalendar } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useI18n } from '@/lib/i18n-client';
 
// Fixed timezone: GMT (UTC)
const FIXED_TZ = { label: 'GMT', offset: '+0000', value: 'UTC' } as const;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(d);
  const month = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(d);
  const dayNum = new Intl.DateTimeFormat(undefined, { day: '2-digit' }).format(d);
  const year = new Intl.DateTimeFormat(undefined, { year: 'numeric' }).format(d);
  return { day, month, dayNum, year };
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

function ImpactBadge({ impact }: { impact: string }) {
  const level = impact?.toLowerCase?.() || '';
  const color =
    level.includes('high')
      ? 'bg-red-100 text-red-700'
      : level.includes('med')
      ? 'bg-amber-100 text-amber-700'
      : 'bg-emerald-100 text-emerald-700';
  const label = level ? impact.toUpperCase() : 'N/A';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

function sanitizeHtml(input: string): string {
  if (!input) return '';
  let html = String(input);
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  html = html.replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, '');
  html = html.replace(/ on[a-z]+\s*=\s*'[^']*'/gi, '');
  html = html.replace(/javascript:\s*/gi, '');
  return html;
}

export default function EconomicCalendarPage() {
  const { t } = useI18n();
  const [data, setData] = useState<EconomicCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 6)) // Default to current week
  });

  // Search and Filters
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterImpact, setFilterImpact] = useState<{ high: boolean; medium: boolean; low: boolean }>({
    high: true,
    medium: true,
    low: true,
  });

  // Format date to YYYY-MM-DD
  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fetch data based on current date range
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const startDate = formatDateString(dateRange.start);
      const endDate = formatDateString(dateRange.end);
      
      const result = await fetchEconomicCalendarByDateRange(startDate, endDate);
      setData(result || []);
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTime(FIXED_TZ.offset));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Update date range when view changes
  useEffect(() => {
    if (view === 'day') {
      setDateRange({
        start: new Date(selectedDate),
        end: new Date(selectedDate)
      });
    } else {
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 6); // Show 1 week
      setDateRange({
        start: new Date(selectedDate),
        end: endDate
      });
    }
  }, [view, selectedDate]);

  // Navigate to previous day/week
  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
    
    // Update date range based on view
    if (view === 'day') {
      setDateRange({
        start: new Date(newDate),
        end: new Date(newDate)
      });
    } else {
      const endDate = new Date(newDate);
      endDate.setDate(newDate.getDate() + 6);
      setDateRange({
        start: new Date(newDate),
        end: endDate
      });
    }
  };

  // Navigate to today
  const navigateToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    
    if (view === 'day') {
      setDateRange({
        start: today,
        end: today
      });
    } else {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 6);
      setDateRange({
        start: today,
        end: endDate
      });
    }
  };

  // Navigate to yesterday
  const navigateToYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setSelectedDate(yesterday);
    
    if (view === 'day') {
      setDateRange({
        start: yesterday,
        end: yesterday
      });
    }
  };

  // Navigate to tomorrow
  const navigateToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
    
    if (view === 'day') {
      setDateRange({
        start: tomorrow,
        end: tomorrow
      });
    }
  };

  // Navigate to last week
  const navigateToLastWeek = () => {
    const lastWeek = new Date(selectedDate);
    lastWeek.setDate(selectedDate.getDate() - 7);
    setSelectedDate(lastWeek);
    
    const endDate = new Date(lastWeek);
    endDate.setDate(lastWeek.getDate() + 6);
    setDateRange({
      start: lastWeek,
      end: endDate
    });
  };

  // Navigate to next week
  const navigateToNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(selectedDate.getDate() + 7);
    setSelectedDate(nextWeek);
    
    const endDate = new Date(nextWeek);
    endDate.setDate(nextWeek.getDate() + 6);
    setDateRange({
      start: nextWeek,
      end: endDate
    });
  };

  // Handle view change
  const handleViewChange = (newView: 'week' | 'day') => {
    setView(newView);
    
    if (newView === 'day') {
      setDateRange({
        start: new Date(selectedDate),
        end: new Date(selectedDate)
      });
    } else {
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 6);
      setDateRange({
        start: new Date(selectedDate),
        end: endDate
      });
    }
  };

  // Get current time in selected timezone
  function getCurrentTime(_offset: string) {
    // Always show current time in UTC as GMT
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(new Date());
  }

  // Get week dates for the week containing the selected date
  const getWeekDates = (date: Date) => {
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startDate);
      newDate.setDate(diff + i);
      weekDates.push(newDate);
    }
    
    return weekDates;
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Group data by date
  const groupDataByDate = (data: EconomicCalendar[]) => {
    const groups = new Map<string, EconomicCalendar[]>();
    
    for (const item of data || []) {
      const key = new Date(item.datetime).toISOString().split('T')[0];
      const arr = groups.get(key) || [];
      arr.push(item);
      groups.set(key, arr);
    }
    
    // Sort days ascending, and each group by time ascending
    const sortedDays = Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    
    for (const [, arr] of sortedDays) {
      arr.sort(
        (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );
    }
    
    return sortedDays;
  };

  // Apply client-side search and impact filters before grouping
  const applyClientFilters = (items: EconomicCalendar[]) => {
    let result = items;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((it) =>
        (it.title || '').toLowerCase().includes(q)
      );
    }
    const activeImpacts = new Set<string>([
      filterImpact.high ? 'high' : '',
      filterImpact.medium ? 'medium' : '',
      filterImpact.low ? 'low' : '',
    ].filter(Boolean));
    if (activeImpacts.size > 0 && activeImpacts.size < 3) {
      result = result.filter((it) => {
        const lvl = (it.impact || '').toLowerCase();
        if (lvl.includes('high')) return activeImpacts.has('high');
        if (lvl.includes('med')) return activeImpacts.has('medium');
        return activeImpacts.has('low');
      });
    }
    return result;
  };

  // Filter data based on selected date and view
  const getFilteredData = () => {
    const base = applyClientFilters(data);
    const grouped = groupDataByDate(base);
    if (view === 'day') {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      return grouped.filter(([date]) => date === selectedDateStr);
    } else {
      // Week view - show all days in the current week
      const weekDates = getWeekDates(selectedDate);
      const weekDateStrs = weekDates.map(date => date.toISOString().split('T')[0]);
      return grouped.filter(([date]) => 
        weekDateStrs.includes(date)
      );
    }
  };

  const filteredData = getFilteredData();
  const weekDates = getWeekDates(selectedDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Calendar Filter Component */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        {/* Quick Navigation */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigateToYesterday}>{t('calendar.yesterday')}</Button>
            <Button variant="ghost" size="sm" onClick={navigateToToday}>{t('calendar.today')}</Button>
            <Button variant="ghost" size="sm" onClick={navigateToTomorrow}>{t('calendar.tomorrow')}</Button>
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigateToLastWeek}>{t('calendar.last_week')}</Button>
            <Button variant="ghost" size="sm" onClick={navigateToToday}>{t('calendar.this_week')}</Button>
            <Button variant="ghost" size="sm" onClick={navigateToNextWeek}>{t('calendar.next_week')}</Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span>{FIXED_TZ.label}</span>
              <span className="text-slate-500">{currentTime}</span>
              <span className="text-slate-400">{`GMT(${FIXED_TZ.offset})`}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <Tabs 
              value={view} 
              onValueChange={(value) => handleViewChange(value as 'week' | 'day')} 
              className="w-[180px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="week">{t('calendar.week')}</TabsTrigger>
                <TabsTrigger value="day">{t('calendar.day')}</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="sm" className="gap-2" onClick={() => setFiltersOpen((v) => !v)}>
              <SlidersHorizontal className="h-4 w-4" />
              <span>{t('calendar.filters')}</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setSearchOpen((v) => !v)}>
              <Search className="h-4 w-4" />
              <span>{t('calendar.search')}</span>
            </Button>

            {/* Filters popover */}
            {filtersOpen && (
              <div className="absolute right-0 top-12 z-10 w-64 rounded-lg border border-slate-200 bg-white shadow-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-700">{t('calendar.filters')}</div>
                  <button onClick={() => setFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                </div>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" checked={filterImpact.high} onChange={(e) => setFilterImpact((f) => ({ ...f, high: e.target.checked }))} />
                    <span>High impact</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" checked={filterImpact.medium} onChange={(e) => setFilterImpact((f) => ({ ...f, medium: e.target.checked }))} />
                    <span>Medium impact</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" checked={filterImpact.low} onChange={(e) => setFilterImpact((f) => ({ ...f, low: e.target.checked }))} />
                    <span>Low impact</span>
                  </label>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setFilterImpact({ high: true, medium: true, low: true })}>Reset</Button>
                  <Button size="sm" onClick={() => setFiltersOpen(false)}>Apply</Button>
                </div>
              </div>
            )}

            {/* Search popover */}
            {searchOpen && (
              <div className="absolute right-0 top-12 z-10 w-72 rounded-lg border border-slate-200 bg-white shadow-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-700">{t('calendar.search')}</div>
                  <button onClick={() => setSearchOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t('calendar.search_placeholder')}
                    className="flex-1 h-9 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button size="sm" onClick={() => setSearchOpen(false)}>{t('calendar.apply')}</Button>
                </div>
                {searchQuery && (
                  <button className="mt-2 text-xs text-slate-500 hover:underline" onClick={() => setSearchQuery('')}>Clear</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date Carousel */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateDate(view === 'week' ? -7 : -1)} 
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-4 overflow-x-auto py-2 hide-scrollbar">
              {weekDates.map((date, i) => {
                const dateStr = date.toISOString().split('T')[0];
                const { day, month, dayNum, year } = formatDate(dateStr);
                const isSelected = view === 'day' 
                  ? date.toDateString() === selectedDate.toDateString()
                  : date.getDay() === selectedDate.getDay() && 
                    date.getDate() === selectedDate.getDate();
                
                return (
                  <button 
                    key={i} 
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[60px] sm:min-w-[80px] py-2 px-1 sm:px-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs text-slate-500">
                      {day.substring(0, 3).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium mt-1">{dayNum}</span>
                    {isToday(date) && (
                      <span className="text-[10px] text-blue-500 mt-1">
                        {t('calendar.today_badge')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateDate(view === 'week' ? 7 : 1)} 
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {filteredData.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          {t('calendar.no_events_for_view')}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredData.map(([dayKey, items]) => {
            const { day, month, dayNum, year } = formatDate(dayKey);
            return (
              <section
                key={dayKey}
                className="rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-200 bg-white"
              >
                <header className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <div className="grid w-full grid-cols-1 md:grid-cols-[110px_1fr_120px_100px_100px_100px] items-center gap-3">
                    <div className="flex items-center gap-3 md:col-span-2">
                      <div className="flex flex-col items-center justify-center w-14 shrink-0 rounded-md bg-white border border-slate-200 py-1">
                        <span className="text-xs text-slate-500">{month.toUpperCase()}</span>
                        <span className="text-xl font-bold text-slate-800">{dayNum}</span>
                        <span className="text-[10px] text-slate-400">{year}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                        {day}
                      </h2>
                    </div>
                    <div className="hidden md:block text-[11px] text-slate-500 text-center">{t('calendar.impact')}</div>
                    <div className="hidden md:block text-[11px] text-slate-500 text-right">{t('calendar.actual')}</div>
                    <div className="hidden md:block text-[11px] text-slate-500 text-right">{t('calendar.forecast')}</div>
                    <div className="hidden md:block text-[11px] text-slate-500 text-right">{t('calendar.previous')}</div>
                  </div>
                </header>

                <div className="divide-y divide-slate-200 bg-white">
                  <Accordion type="single" collapsible>
                    {items.map((item, i) => (
                      <AccordionItem key={item.id ?? i} value={(item.id ?? i).toString()}>
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="grid w-full grid-cols-1 md:grid-cols-[110px_1fr_120px_100px_100px_100px] items-center gap-3 text-left">
                            <div className="text-sm font-medium text-slate-500">
                              {formatTime(item.datetime)}
                            </div>
                            <div className="text-sm font-medium text-slate-800">
                              {item.title}
                            </div>
                            <div className="hidden md:flex justify-center">
                              <ImpactBadge impact={item.impact} />
                            </div>
                            <div className="hidden md:block text-right text-sm font-medium text-slate-800">
                              {item.actual || '-'}
                            </div>
                            <div className="hidden md:block text-right text-sm text-slate-500">
                              {item.forecast || '-'}
                            </div>
                            <div className="hidden md:block text-right text-sm text-slate-500">
                              {item.previous || '-'}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                  <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 border-r border-slate-200">{t('calendar.measures')}</div>
                                  <div 
                                    className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml((item as any).measures || '') }}
                                  />
                                </div>
                                <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                  <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 border-r border-slate-200">{t('calendar.usual_effect')}</div>
                                  <div 
                                    className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml((item as any).usual_effect || '') }}
                                  />
                                </div>
                                <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                  <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 border-r border-slate-200">{t('calendar.why_traders_care')}</div>
                                  <div 
                                    className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml((item as any).traders_care || '') }}
                                  />
                                </div>
                                {/* hide the notes if notes is null */}
                                {item.notes && (
                                  <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                    <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 border-r border-slate-200">{t('calendar.notes')}</div>
                                    <div 
                                      className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700"
                                      dangerouslySetInnerHTML={{ __html: sanitizeHtml((item as any).notes || '') }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
