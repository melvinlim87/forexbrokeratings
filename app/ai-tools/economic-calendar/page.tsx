'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchEconomicCalendar, fetchEconomicCalendarByDateRange, type EconomicCalendar } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

type Timezone = {
  value: string;
  label: string;
  offset: string;
};

const timezones: Timezone[] = [
  { value: 'UTC', label: 'GMT', offset: '+0000' },
  { value: 'America/New_York', label: 'New York', offset: '-0500' },
  { value: 'America/Chicago', label: 'Chicago', offset: '-0600' },
  { value: 'America/Denver', label: 'Denver', offset: '-0700' },
  { value: 'America/Los_Angeles', label: 'Los Angeles', offset: '-0800' },
  { value: 'Europe/London', label: 'London', offset: '+0000' },
  { value: 'Europe/Paris', label: 'Paris', offset: '+0100' },
  { value: 'Europe/Berlin', label: 'Berlin', offset: '+0100' },
  { value: 'Asia/Tokyo', label: 'Tokyo', offset: '+0900' },
  { value: 'Asia/Shanghai', label: 'Shanghai', offset: '+0800' },
  { value: 'Australia/Sydney', label: 'Sydney', offset: '+1000' },
];

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
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      : level.includes('med')
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
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
  const [data, setData] = useState<EconomicCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timezone, setTimezone] = useState<Timezone>(timezones[0]);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 6)) // Default to current week
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
      setCurrentTime(getCurrentTime(timezone.offset));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [timezone.offset]);

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
  function getCurrentTime(offset: string) {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + 3600000 * parseInt(offset) / 100);
    return localTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone.value 
    });
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

  // Filter data based on selected date and view
  const getFilteredData = () => {
    if (view === 'day') {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      return groupDataByDate(data).filter(([date]) => date === selectedDateStr);
    } else {
      // Week view - show all days in the current week
      const weekDates = getWeekDates(selectedDate);
      const weekDateStrs = weekDates.map(date => date.toISOString().split('T')[0]);
      return groupDataByDate(data).filter(([date]) => 
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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
        {/* Quick Navigation */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigateToYesterday}>Yesterday</Button>
            <Button variant="ghost" size="sm" onClick={navigateToToday}>Today</Button>
            <Button variant="ghost" size="sm" onClick={navigateToTomorrow}>Tomorrow</Button>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigateToLastWeek}>Last Week</Button>
            <Button variant="ghost" size="sm" onClick={navigateToToday}>This Week</Button>
            <Button variant="ghost" size="sm" onClick={navigateToNextWeek}>Next Week</Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span>{timezone.label}</span>
              <span className="text-slate-500 dark:text-slate-400">{currentTime}</span>
              <Select 
                value={timezone.value} 
                onValueChange={(value) => {
                  const tz = timezones.find(tz => tz.value === value);
                  if (tz) setTimezone(tz);
                }}
              >
                <SelectTrigger className="w-[180px] h-8 border-0 shadow-none p-0">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label} (GMT{tz.offset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Tabs 
              value={view} 
              onValueChange={(value) => handleViewChange(value as 'week' | 'day')} 
              className="w-[180px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
        </div>

        {/* Date Carousel */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
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
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {day.substring(0, 3).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium mt-1">{dayNum}</span>
                    {isToday(date) && (
                      <span className="text-[10px] text-blue-500 dark:text-blue-400 mt-1">
                        TODAY
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
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center text-slate-600 dark:text-slate-300">
          No economic events found for the selected {view}.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredData.map(([dayKey, items]) => {
            const { day, month, dayNum, year } = formatDate(dayKey);
            return (
              <section
                key={dayKey}
                className="rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800"
              >
                <header className="px-4 sm:px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700">
                  <div className="grid w-full grid-cols-1 md:grid-cols-[110px_1fr_120px_100px_100px_100px] items-center gap-3">
                    <div className="flex items-center gap-3 md:col-span-2">
                      <div className="flex flex-col items-center justify-center w-14 shrink-0 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1">
                        <span className="text-xs text-slate-500">{month.toUpperCase()}</span>
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{dayNum}</span>
                        <span className="text-[10px] text-slate-400">{year}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100">
                        {day}
                      </h2>
                    </div>
                    <div className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 text-center">Impact</div>
                    <div className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 text-right">Actual</div>
                    <div className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 text-right">Forecast</div>
                    <div className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 text-right">Previous</div>
                  </div>
                </header>

                <div className="divide-y divide-slate-200 dark:divide-slate-700 bg-white">
                  <Accordion type="single" collapsible>
                    {items.map((item, i) => (
                      <AccordionItem key={item.id ?? i} value={(item.id ?? i).toString()}>
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="grid w-full grid-cols-1 md:grid-cols-[110px_1fr_120px_100px_100px_100px] items-center gap-3 text-left">
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              {formatTime(item.datetime)}
                            </div>
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                              {item.title}
                            </div>
                            <div className="hidden md:flex justify-center">
                              <ImpactBadge impact={item.impact} />
                            </div>
                            <div className="hidden md:block text-right text-sm font-medium text-slate-800 dark:text-slate-100">
                              {item.actual || '-'}
                            </div>
                            <div className="hidden md:block text-right text-sm text-slate-500 dark:text-slate-400">
                              {item.forecast || '-'}
                            </div>
                            <div className="hidden md:block text-right text-sm text-slate-500 dark:text-slate-400">
                              {item.previous || '-'}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                  <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">Measures</div>
                                  <div 
                                    className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700 dark:text-slate-200"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml((item as any).measures || '') }}
                                  />
                                </div>
                                <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                  <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">Usual Effect</div>
                                  <div 
                                    className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700 dark:text-slate-200"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml((item as any).usual_effect || '') }}
                                  />
                                </div>
                                <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                  <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">Why Traders Care</div>
                                  <div 
                                    className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700 dark:text-slate-200"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml((item as any).traders_care || '') }}
                                  />
                                </div>
                                {/* hide the notes if notes is null */}
                                {item.notes && (
                                  <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4">
                                    <div className="col-span-12 md:col-span-3 text-xs font-medium text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700">Notes</div>
                                    <div 
                                      className="col-span-12 md:col-span-9 text-sm leading-6 text-slate-700 dark:text-slate-200"
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
