"use client";

import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, Check, X, Star, TimerIcon, UserCircle2, Info, CheckCircle } from 'lucide-react';

// Ensures date is always formatted as dd/MM/yyyy for SSR/CSR consistency
function formatDateDMY(date: string | number | Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const time = d.toLocaleTimeString();
  return `${day}/${month}/${year} ${time}`;
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AiResultModal from '@/components/ui/AiResultModal';
import { HexagonChart } from './hexagon-chart';
import { cn } from '@/lib/utils';
import { BrokerDetails } from '@/lib/supabase';
import BrokerReviewForm from './BrokerReviewForm';
import { fetchReviewsByBrokerId } from '@/lib/supabase';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { insertReviewVote, deleteReviewVote, updateReviewVote } from '@/lib/review-votes';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LoginModal from '@/components/ui/LoginModal';
import { LoginModalProvider, useLoginModal } from '@/components/broker/LoginModalContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BrokerProfileProps {
  brokerData: BrokerDetails;
  relatedBrokers: any[];
}

// Type guard for promo.conditions (table)
function isTableCondition(
  cond: any
): cond is { type: 'table'; headers: string[]; rows: string[][]; extra?: string[]; warning?: string } {
  return (
    cond &&
    typeof cond === 'object' &&
    cond.type === 'table' &&
    Array.isArray(cond.headers) &&
    Array.isArray(cond.rows)
  );
}

// Type guard for promo.conditions (list)
function isListCondition(
  cond: any
): cond is { type: 'list'; items: string[]; extra?: string[]; warning?: string } {
  return (
    cond &&
    typeof cond === 'object' &&
    cond.type === 'list' &&
    Array.isArray(cond.items)
  );
}


export default function BrokerProfile({ brokerData, relatedBrokers }: BrokerProfileProps) {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalResult, setAiModalResult] = useState('');
  const [aiGetResult, setAiGetResult] = useState(false);
  const { open, setOpen } = useLoginModal();
  const [showRegulatory, setShowRegulatory] = useState(false);
  const [regulatoryLicense, setRegulatoryLicense] = useState<any>(null);
  // Smooth scroll to #user_reviews with header offset
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#user_reviews') {
      const target = document.getElementById('user_reviews');
      if (target) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 28; // 28px extra spacing
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
    if (window.location.hash === '#ai_analyses') {
      const target = document.getElementById('ai-analyse-btn');
      if (target) {
        target.click()
      }
    }
  }, []);

  const user = useSelector((state: RootState) => state.auth.user);

  const [reviews, setReviews] = useState(brokerData.reviews || []);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);

  // --- Rating filter state ---
  const [selectedRating, setSelectedRating] = useState<'All' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>('All');
  const filteredReviews = selectedRating === 'All'
    ? reviews
    : reviews.filter((r: any) => Math.round(parseFloat(r.rating)) === selectedRating);

  // Smooth scroll to #user_reviews with header offset
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#user_reviews') {
      const target = document.getElementById('user_reviews');
      if (target) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12; // 12px extra spacing
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
  }, []);

  const reloadReviews = async () => {
    setLoadingReviews(true);
    try {
      const newReviews = await fetchReviewsByBrokerId(brokerData.id.toString());
      setReviews(newReviews);
    } catch {
      // Optionally handle error
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleRegulatory = async (license: any) => {
    setShowRegulatory(true);
    setRegulatoryLicense(license);
  }

  const [previewBadge, setPreviewBadge] = useState<string|null>(null);
  // Promotion image carousel modal state
  const [promoPreviewOpen, setPromoPreviewOpen] = useState(false);
  const [previewPromoImages, setPreviewPromoImages] = useState<string[]>([]);
  const [previewPromoImageIdx, setPreviewPromoImageIdx] = useState(0);
  return (
    <div className="min-h-screen mx-0 lg:mx-10">
       {/* Promo Images Carousel Modal */}
       {promoPreviewOpen && previewPromoImages.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPromoPreviewOpen(false)}>
            <div className="relative bg-white rounded-xl shadow-xl p-4 max-w-xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setPromoPreviewOpen(false)}
                aria-label="Close preview"
              >
                ×
              </button>
              <div className="flex items-center justify-center w-full">
                <button
                  className="px-2 text-2xl text-gray-400 hover:text-gray-700"
                  onClick={() => setPreviewPromoImageIdx((previewPromoImageIdx - 1 + previewPromoImages.length) % previewPromoImages.length)}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <img
                  src={previewPromoImages[previewPromoImageIdx].startsWith('/') || previewPromoImages[previewPromoImageIdx].startsWith('http') ? previewPromoImages[previewPromoImageIdx] : `/assets/images/promotions/${previewPromoImages[previewPromoImageIdx]}`}
                  alt={`Promotion Preview ${previewPromoImageIdx + 1}`}
                  className="max-h-[120vh] w-auto rounded-xl border border-gray-200 shadow-lg mx-4 bg-white object-contain"
                />
                <button
                  className="px-2 text-2xl text-gray-400 hover:text-gray-700"
                  onClick={() => setPreviewPromoImageIdx((previewPromoImageIdx + 1) % previewPromoImages.length)}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">{previewPromoImageIdx + 1} / {previewPromoImages.length}</div>
            </div>
          </div>
        )}
      <div className="bg-metallic pt-4 pb-4 relative overflow-hidden rounded-lg">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Modal for regulatory */}
        {showRegulatory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowRegulatory(false)}>
            <div 
              className="relative rounded-lg shadow-xl lg:p-12 p-8 max-w-4xl w-full flex flex-col items-center"
              style={{
                maxHeight: '70vh', 
                minHeight: '300px',
                background: 'transparent',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <img 
                src={'/assets/images/certificate/certficate_background.png'} 
                alt="cert_background" 
                style={{
                  height: '98%',
                  left: '1%',
                  position: 'absolute',
                  top: '1%',
                  width: '98%',
                  zIndex: -1,
                  padding: '10px',
                  backgroundColor:'white',
                  borderRadius: '0.7rem'
                }}
              />
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={e => { e.stopPropagation(); setShowRegulatory(false); }}
                aria-label="Close preview"
              >
                ×
              </button>
              {/* display regulatory information here according to regulatoryLicense */}
              {/* Certificate-style Regulatory Modal */}
              {/* Hide scrollbar */}
              <div className="w-full p-4" style={{
                  maxHeight: '82vh', 
                  overflowY: 'auto',
                  position: 'relative',
                  zIndex: 1,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}>
                {/* Header */}
                {/* If in mobile view, make the image and name display col */}
                <div className="flex items-center gap-3 mb-2 lg:flex-row flex-col">
                  <img
                    src={regulatoryLicense?.license_image}
                    alt={regulatoryLicense?.name}
                    className="w-42 object-contain border rounded bg-white lg:w-42 lg:h-24 lg:object-contain"
                  />
                  <div>
                    <div className="text-lg font-bold">{regulatoryLicense?.fullname || "Regulator"}</div>
                    {/* When hover to introduction will show tooltip of regulatoryLicense.description */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-gray-500 cursor-pointer">Regulatory Agencies Introduction</div>
                        </TooltipTrigger>
                        <TooltipContent className="w-64" side="bottom">
                          <div className="text-xs">
                            {regulatoryLicense?.description}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {/* Status and License Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center my-3 gap-2">
                  <div className="col-span-1">
                    <span>Current Status:</span> <br />
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        regulatoryLicense?.is_regulated
                          ? "bg-green-200 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {regulatoryLicense?.is_regulated ? "Regulated" : "Unregulated"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span>License Type:</span> <br />
                    <span className="font-bold">
                      {regulatoryLicense?.license_type || "-"}
                    </span>
                  </div>
                </div>
                {/* Regulated By and License No. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center my-3 gap-2">
                  <div className="col-span-1">
                    <span>Regulated By:</span> <br />
                    <span className="font-bold">
                      {regulatoryLicense?.regulated_by || "-"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="">License No:</span> <br />
                    <span className="font-bold">{regulatoryLicense?.license_no || "-"}</span>
                  </div>
                </div>
                {regulatoryLicense.countries && regulatoryLicense.countries.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center my-3 gap-2">
                    <div className="col-span-1">
                      <span>Authorized Countries:</span> <br />
                      <span className="font-bold">
                        {regulatoryLicense?.countries.join(", ") || "-"}
                    </span>
                  </div>
                </div>
                )}
                <hr className="my-2 border-t-2 border-gray-300" />
                {/* Entity and Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center my-3 gap-2">
                  <div className="col-span-1">
                    <span>License Entity:</span> <br />
                    <span className="font-bold">
                      {regulatoryLicense?.license_entity || "-"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="">Effective Date:</span> <br />
                    <span className="font-bold">{regulatoryLicense?.effective_date || "-"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center my-3 gap-2">
                  <div className="col-span-1">
                    <span>Email Address of Licensed Institution:</span> <br />
                    <span className="font-bold">
                      {regulatoryLicense?.email || "-"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="">Sharing Status:</span> <br />
                    <span className="font-bold">{regulatoryLicense?.sharing_status || "-"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center my-3 gap-2">
                  <div className="col-span-1">
                    <span>Website of Licensed Institution:</span> <br />
                    <span className="font-bold">
                      {regulatoryLicense?.websites || "-"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="">Expiration Time:</span> <br />
                    <span className="font-bold">{regulatoryLicense?.expiration_time || "-"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center my-3 gap-2">
                  <div className="col-span-1">
                    <span>Address of Licensed Institution:</span> <br />
                    <span className="font-bold text-ellipsis overflow-hidden">
                      {regulatoryLicense?.address || "-"}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="">Phone Number of Licensed Institution:</span> <br />
                    <span className="font-bold">{regulatoryLicense?.phone || "-"}</span>
                  </div>
                </div>
                {/* Certified Documents (if any) */}
                {regulatoryLicense?.documents && regulatoryLicense.documents.length > 0 && (  
                  <div className="grid grid-cols-1 items-center my-3 gap-2">
                    <div className="col-span-1">
                      <span>Licensed Insitution Certified Documents:</span> <br />
                      <span className="flex flex-wrap gap-2">
                        {regulatoryLicense.documents.map((doc: string, idx: number) => (
                          <a key={idx} href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            Annex{idx + 1}
                          </a>
                        ))}
                      </span>
                    </div>
                  </div>
                )}
                {/* Regulated Stamp */}
              </div>
              {regulatoryLicense?.is_regulated && (
                <div className="absolute bottom-8 right-8 opacity-60">
                  <img src="/assets/images/certificate/regulated.png" alt="Regulated Stamp" className="h-28 w-28" />
                </div>
              )}
            </div>
          </div>
        )}
        {/* Broker Summary */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-2">
            {/* Summary Left Side */}
            <div className="flex flex-col justify-between h-full col-span-2 ">
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                {/* Image and Name */}
                <div className='flex flex-col md:flex-row md:items-center gap-2'>
                  <div className="h-24 w-24 relative bg-white backdrop-blur-sm rounded-lg p-2 mx-auto md:mx-0">
                    {brokerData.logo ? (
                      <Image
                        src={brokerData.logo}
                        alt={brokerData.name}
                        fill
                        className="object-contain rounded-lg"
                        sizes="96px"
                        priority
                      />
                    ) : 
                      null
                    }
                  </div>
                  <div className="flex flex-col items-center md:items-start mt-2 md:mt-0">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white text-center md:text-left">
                      {brokerData.name}
                    </h1>
                    {brokerData.is_regulated && (
                      <Badge variant="outline" className="text-sm md:text-md text-green-300 dark:text-green-400 pl-2 items-center rounded-full bg-green-900/40 dark:bg-green-900/30 border border-green-300 mt-1">
                        Regulated
                      </Badge>
                    )}
                  </div>
                </div>
                {/* Broker Year Published and Headquarters */}
                <div className='flex flex-col items-center md:items-end justify-center gap-1'>
                  <p className="text-md text-gray-700 dark:text-gray-300 px-2 text-center md:text-right">
                    {brokerData.headquarters} | {brokerData.year_published}
                  </p>
                  <div className="flex items-center mt-2 px-2 justify-center md:justify-end">
                    <div className="flex items-center backdrop-blur-sm rounded-xl">
                      <div className="flex space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                        const rating = brokerData.rating ? (parseFloat(brokerData.rating) / 20) || 0 : 0;
                        return (
                          <Star
                            key={star}
                            className={cn(
                              "h-5 w-5",
                              star <= Math.floor(rating)
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300 dark:text-gray-600"
                            )}
                          />
                        );
                      })}
                      <span className="pl-2 font-semibold text-gray-900 dark:text-white">
                        {brokerData.rating ? (parseFloat(brokerData.rating) / 20).toFixed(2) : '—'} / 5
                      </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                {brokerData.summary}
              </p>
              {/* Additional Broker Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div className="col-span-1 bg-black/5 rounded-lg p-4 flex grid items-center">
                  <div className="text-gray-800 font-bold text-xl md:text-2xl text-center">{brokerData.spread_eur_usd || 'N/A'}</div>
                  <div className="text-black text-xs md:text-sm text-center justify-end">Min Spread</div>
                </div>
                <div className="col-span-1 bg-black/5 rounded-lg p-4 flex grid items-center">
                  <div className="text-gray-800 font-bold text-xl md:text-2xl text-center">{brokerData?.leverage_max}</div>
                  <div className="text-black text-xs md:text-sm text-center justify-end">Max Leverage</div>
                </div>
                <div className="col-span-1 bg-black/5 rounded-lg p-4 flex grid items-center">
                  <div className="text-gray-800 font-bold text-xl md:text-2xl text-center">{brokerData?.min_deposit}</div>
                  <div className="text-black text-xs md:text-sm text-center justify-end">Min Deposit</div>
                </div>
                <div className="col-span-1 bg-black/5 rounded-lg p-4 flex grid items-center">
                  <div className="text-gray-800 font-bold text-xl md:text-2xl text-center">{brokerData?.response_time}</div>
                  <div className="text-black text-xs md:text-sm text-center justify-end">Execution Speed</div>
                </div>
              </div>
              {brokerData.badges && brokerData.badges.length > 0 && (
                <div className="rounded-xl flex flex-col ">
                  <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Awards & Recognition</div>
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 py-2 w-full rounded place-items-center">
                    {brokerData.badges.map((src: string, idx: number) => {
                      const imgSrc = src.startsWith('/') || src.startsWith('http')
                        ? src
                        : `/assets/images/badges/${src}`;
                      return (
                        <img
                          key={idx}
                          src={imgSrc}
                          alt={`badge-${idx}`}
                          className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full border border-gray-200 shadow-lg bg-gray-50 hover:bg-gray-100 transition duration-150 cursor-pointer object-contain"
                          onClick={() => setPreviewBadge(imgSrc)}
                        />
                      );
                    })}
                  </div>
                  {previewBadge && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewBadge(null)}>
                      <div className="relative bg-white rounded-xl shadow-xl p-4 max-w-lg w-full flex flex-col items-center">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                          onClick={e => { e.stopPropagation(); setPreviewBadge(null); }}
                          aria-label="Close preview"
                        >
                          ×
                        </button>
                        <img src={previewBadge} alt="Award Preview" className="max-h-[60vh] w-auto rounded-full border border-gray-200 shadow-lg" style={{ background: '#fff', objectFit: 'contain' }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Sidebar Right Side */}
            <div className="flex flex-col gap-3 h-full justify-end w-full">
              {/* Broker Metrics Hexagon Chart */}
                  <h3 className="text-xl font-semibold text-center">Broker Metrics</h3>
                  <div className="flex justify-center mx-auto">
                    <div className="p-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500">
                      <div className="bg-white rounded-lg">
                        <HexagonChart 
                          data={[
                            [
                              { 
                                label: 'User Traffic', 
                                value: brokerData.user_traffic || 0,
                                maxValue: 100 
                              },
                              { 
                                label: 'Regulations', 
                                value: brokerData.regulations || 0,
                                maxValue: 100 
                              },
                              { 
                                label: 'Risk Control', 
                                value: brokerData.risk_control || 0,
                                maxValue: 100 
                              },
                              { 
                                label: 'Promotions', 
                                value: brokerData.promotions || 0,
                                maxValue: 100 
                              },
                              { 
                                label: 'User Ratings', 
                                value: brokerData.user_experience || 0,
                                maxValue: 100 
                              },
                              { 
                                label: 'Trading Platform', 
                                value: brokerData.environment || 0,
                                maxValue: 100 
                              },
                            ]
                          ]}
                          size={240}
                        />
                      </div>
                    </div>  
                  </div>
              <Link 
                href={brokerData.website || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full"
              >
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-metallic hover:shadow-metallic-hover"
                  disabled={!brokerData.website}
                >
                  {brokerData.website ? `Visit ${brokerData.name}` : 'Website Not Available'}
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={async () => {
                  if (typeof window === 'undefined') return;
                  
                  try {
                    // Dynamically import the compare-utils
                    const { setCompareSelection } = await import('@/components/broker/compare-utils');
                    
                    // Prepare broker data to be stored
                    const brokerInfo = {
                      id: brokerData.id?.toString(),
                      name: brokerData.name,
                      logo: brokerData.logo,
                      rating: brokerData.rating,
                      spread_eur_usd: brokerData.spread_eur_usd,
                      leverage_max: brokerData.leverage_max,
                      regulators: brokerData.regulators,
                      min_deposit: brokerData.min_deposit
                    };
                    
                    // Store the broker data in localStorage
                    localStorage.setItem('compare_broker_data', JSON.stringify([brokerInfo]));
                    
                    // Also save the ID for backward compatibility
                    if (brokerData.id) {
                      setCompareSelection(brokerData.id.toString());
                    }
                    
                    // Redirect to compare page
                    window.location.href = '/compare';
                  } catch (error) {
                    // console.error('Error preparing comparison:', error);
                    // Fallback to simple redirect if there's an error
                    window.location.href = '/compare';
                  }
                }}
              >
                Add to Compare
              </Button>

              {/* AI Analyse Button */}
              <Button
                size="lg"
                className="w-full bg-metallic text-black"
                onClick={async () => {
                  if (!user || user.email_confirmed_at == false) {
                    setOpen(true);
                    return;
                  }
                  try {
                    if (aiModalResult == '') {
                      setAiModalOpen(true);
                      setAiModalResult('');
                      const aiBtn = document.getElementById('ai-analyse-btn');
                      if (aiBtn) aiBtn.innerText = 'Analysing...';
                      const res = await fetch('/api/aitools', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.jwt}` },
                        body: JSON.stringify(brokerData)
                      });
                      if (!res.ok) {
                        setAiModalResult('AI Analyse failed: ' + res.statusText);
                        setAiGetResult(true)
                      } else {
                        const data = await res.json();
                        setAiModalResult(data.result || 'No result');
                        setAiGetResult(true)
                      }
                    }
                  } catch (err: any) {
                    setAiModalResult('AI Analyse failed: ' + (err?.message || err));
                  } finally {
                    const aiBtn = document.getElementById('ai-analyse-btn');
                    if (aiBtn) aiBtn.innerText = 'AI Analyse';
                  }
                }}
                id="ai-analyse-btn"
              >
                AI Analyse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion sections */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Promotions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {brokerData.promotion_details && brokerData.promotion_details.length > 0 ? (
                    brokerData.promotion_details.map((promo, idx) => (
                      <div
                        key={promo.id || idx}
                        className="bg-white rounded-xl shadow p-6 flex flex-col h-full border border-gray-100"
                      >
                        {/* Promo Country */}
                        {promo.country && (
                          <div className="mb-1 text-lg text-black font-medium">
                            {promo.country} Only
                          </div>
                        )}
                        {/* Promo Badge/Category */}
                        <div className="mb-2 flex flex-wrap gap-2 flex-row flex-nowrap overflow-x-auto">
                          {promo.categories?.map((category, idx) => (
                            <span
                              key={idx}
                              className={
                                (category.includes('PROMO')
                                  ? 'bg-purple-500 text-white '
                                  : category.includes('BONUS')
                                  ? 'bg-pink-500 text-white '
                                  : category.includes('FREE')
                                  ? 'bg-blue-500 text-white '
                                  : category.includes('LIMITED')
                                  ? 'bg-green-500 text-white '
                                  : 'bg-gray-300 text-gray-800 ') +
                                'px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap mr-2'
                              }
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                        {/* Promotion Images */}
                        {promo.images && promo.images.length > 0 && (
                          <img
                            src={promo.images[0].startsWith('/') || promo.images[0].startsWith('http') ? promo.images[0] : `/assets/images/promotions/${promo.images[0]}`}
                            alt={promo.title}
                            className="w-full h-50 object-cover rounded mb-4 border border-gray-200 bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setPreviewPromoImages(promo.images);
                              setPreviewPromoImageIdx(0);
                              setPromoPreviewOpen(true);
                            }}
                          />
                        )}
                        {/* Promo Title */}
                        <div className="font-bold text-2xl mb-2 text-gray-900">{promo.title}</div>
                        {/* Promo Description */}
                        <div className="text-gray-700 text-md mb-4 ">{promo.summary || promo.description}</div>
                        {/* Promo Features/Conditions */}
                        {/* Type guard for table-type promo.conditions */}
                        {isTableCondition(promo.conditions) && (
                          <div className="mb-4">
                            <table className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
                              <thead className="bg-blue-50">
                                <tr>
                                  {promo.conditions.headers.map((header, idx) => (
                                    <th key={idx} className="py-2 px-3 font-bold text-gray-900 border-b">{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {promo.conditions.rows.map((row, i) => (
                                  <tr key={i} className="even:bg-gray-50">
                                    {row.map((cell, j) => (
                                      <td key={j} className="py-2 px-3 border-b text-center">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {promo.conditions.extra && promo.conditions.extra.length > 0 && (
                              <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                                {promo.conditions.extra.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            )}
                            {promo.conditions.warning && promo.conditions.warning.length > 0 && (
                              <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1 border border-yellow-300">
                                {promo.conditions.warning}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Type guard for list-type promo.conditions */}
                        {isListCondition(promo.conditions) && (
                          <div className="mb-4">
                            <ul className="text-xs text-gray-700 list-disc list-inside">
                              {promo.conditions.items.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                            {promo.conditions.extra && promo.conditions.extra.length > 0 && (
                              <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                                {promo.conditions.extra.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            )}
                            {promo.conditions.warning && promo.conditions.warning.length > 0 && (
                              <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1 border border-yellow-300">
                                {promo.conditions.warning}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Promo Button Instructional Text */}
                        <div className="text-xs text-gray-500 mb-2 flex ">
                          <Info className="h-8 w-8 text-gray-400 mr-1" />
                          Sign up with our referral link, trade the required lots, and tell RS Finance support you saw this on Forex Broker Ratings to get your cash bonus.
                        </div>
                        <a
                          href={promo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            promo.category === 'CASHBACK'
                              ? 'mt-auto inline-flex items-center justify-center w-full px-4 py-2 rounded bg-orange-500 text-white font-semibold text-sm shadow hover:brightness-110 transition disabled:opacity-50'
                              : 'mt-auto inline-flex items-center justify-center w-full px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm shadow hover:brightness-110 transition disabled:opacity-50'
                          }
                          style={{ pointerEvents: promo.link ? 'auto' : 'none', opacity: promo.link ? 1 : 0.6 }}
                        >
                          Claim This Offer
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-gray-400">No promotions available</div>
                  )}
                </div>
              </div>
            </Card>

            {/* Overview */}
            <Card 
            className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
            <div className="p-6">
                {/* h2 show underline */}
                <h2 className="text-2xl font-semibold mb-4 border-b border-black pb-2">Broker Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-11 gap-6">
                  {/* Trading Info */}
                  <div className='col-span-5'>
                    <h3 className="text-lg font-medium mb-3">Trading Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">EUR/USD Spread</span>
                        <span className="font-medium text-cyan-600">{brokerData.spread_eur_usd || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Trading Platforms</span>
                        <span className="font-medium text-right break-all flex flex-wrap gap-2 md:gap-1 justify-end">
                          {(brokerData.platforms ?? []).length > 0
                            ? (brokerData.platforms ?? []).map((p, i) => (
                                <span key={i} className="whitespace-nowrap">{p}{i < (brokerData.platforms?.length ?? 0) - 1 ? ',' : ''}</span>
                              ))
                            : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Instruments</span>
                        <span className="font-medium text-right break-all flex flex-wrap gap-2 md:gap-1 justify-end">
                          {(brokerData.instruments ?? []).length > 0
                            ? (brokerData.instruments ?? []).map((inst, i) => (
                                <span key={i} className="whitespace-nowrap">{inst}{i < (brokerData.instruments?.length ?? 0) - 1 ? ',' : ''}</span>
                              ))
                            : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Year Established</span>
                        <span className="font-medium">{brokerData.year_published || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Has API</span>
                        <span className="font-medium">{brokerData.has_api ? 'Yes' : 'No'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Has Demo Account</span>
                        <span className="font-medium">{brokerData.has_demo_account ? 'Yes' : 'No'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Has Mobile Trading</span>
                        <span className="font-medium">{brokerData.has_mobile_trading ? 'Yes' : 'No'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Has Web Based Trading</span>
                        <span className="font-medium">{brokerData.has_web_based_trading ? 'Yes' : 'No'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Lot Size</span>
                        <span className="font-medium">{brokerData.min_lot || 'N/A'} - {brokerData.max_lot || 'N/A'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className='col-span-1'>
                    {/* Center show a centered straight line */}
                    <div className='w-[50%] h-full flex items-center justify-center border-r border-black'></div>
                  </div>
                  {/* Account & Support */}
                  <div className='col-span-5'>
                    <h3 className="text-lg font-medium mb-3">Account & Support</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Account Types</span>
                        <div className="flex flex-wrap gap-2 md:gap-1 justify-end">
                          {brokerData.account_types?.map((account_type, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700 whitespace-nowrap" style={{borderRadius: '1.25rem'}}>{account_type}</span>
                          ))}
                        </div>
                        {/* <span className="font-medium text-right">
                          {brokerData.account_types?.length ? brokerData.account_types.join(', ') : 'N/A'}
                        </span> */}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Base Currencies</span>
                        <div className="flex flex-wrap gap-2 md:gap-1 justify-end">
                          {brokerData.base_currencies?.map((base_currency, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700 whitespace-nowrap" style={{borderRadius: '1.25rem'}}>{base_currency}</span>
                          ))}
                        </div>
                        {/* <span className="font-medium text-right">
                          {brokerData.base_currencies?.length ? brokerData.base_currencies.join(', ') : 'N/A'}
                        </span> */}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Customer Support</span>
                        <span className="font-medium">{brokerData.availability || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                        <span className="font-medium">{brokerData.response_time || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Languages</span>
                        <div className="flex flex-wrap gap-2 md:gap-1 justify-end">
                          {brokerData.languages?.length ? brokerData.languages.map((language, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700 whitespace-nowrap" style={{borderRadius: '1.25rem'}}>{language}</span>
                          )) : <span className="text-gray-400">N/A</span>}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Regulation & Safety */}
            <Card 
            className={cn(
              "overflow-hidden relative",
              "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
              "backdrop-blur-sm",
              "border-0",
              "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
              "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
              "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
              "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
              "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
              "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
              "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
              "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
            )}>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 border-b border-black pb-2">Regulation & Safety</h2>
                <div className="grid grid-cols-1 md:grid-cols-11 gap-6">
                  <div className="col-span-5">
                    <h3 className="text-lg font-medium mb-3">Regulatory Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Regulators</span>
                        <div className="flex flex-wrap gap-2 md:gap-1 justify-end">
                          {brokerData.regulators?.length ? brokerData.regulators.map((regulator, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700 whitespace-nowrap" style={{borderRadius: '1.25rem'}}>{regulator}</span>
                          )) : <span className="text-gray-400">N/A</span>}
                        </div>
                      </li>
                      {/* <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Licenses</span>
                        <div className="flex flex-wrap gap-2 md:gap-1 justify-end">
                          {brokerData.licenses?.length ? brokerData.licenses.map((license, index) => (
                            <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700 whitespace-nowrap" style={{borderRadius: '1.25rem'}}>{license}</span>
                          )) : <span className="text-gray-400">N/A</span>}
                        </div>
                        <span className="font-medium text-right">
                          {brokerData.licenses?.length ? brokerData.licenses.join(', ') : 'N/A'}
                        </span>
                      </li> */}
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Companies</span>
                        <span className="font-medium text-right">{brokerData.parent_companies?.join(', ') || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Headquarters</span>
                        <span className="font-medium text-right">{brokerData.headquarters || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Regulation Status</span>
                        <span className="font-medium">
                          {brokerData.is_regulated ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center">
                              <Shield className="h-4 w-4 mr-1" /> Regulated
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400">Not Regulated</span>
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className='col-span-1'>
                    <div className='w-[50%] h-full flex items-center justify-center border-r border-black'></div>
                  </div>
                  <div className="col-span-5">
                    <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Email</span>
                        <span className="font-medium">
                          {brokerData.email ? (
                            <a href={`mailto:${brokerData.email}`} className="text-blue-600 hover:underline">
                              {brokerData.email}
                            </a>
                          ) : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Phone</span>
                        <div className="flex flex-col items-end">
                          {brokerData.phone_numbers?.length ? (
                            brokerData.phone_numbers.map((phone, index) => (
                              <a 
                                key={index} 
                                href={`tel:${phone.replace(/\D/g, '')}`} 
                                className="text-blue-600 hover:underline block"
                              >
                                {phone}
                              </a>
                            ))
                          ) : 'N/A'}
                        </div>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Support Channels</span>
                        <div className="flex flex-col items-end">
                          {brokerData.channels?.length ? (
                            brokerData.channels.map((channel, index) => (
                              <span key={index} className="block">
                                {channel}
                              </span>
                            ))
                          ) : 'N/A'}
                        </div>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Availability</span>
                        <span className="font-medium">{brokerData.availability || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                        <span className="font-medium">{brokerData.response_time || 'N/A'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Address</span>
                        <span className="font-medium text-right">{brokerData.headquarters || 'N/A'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deposit & Withdrawal */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 border-b border-black pb-2">Deposit & Withdrawal</h2>
                <div className="grid grid-cols-1 md:grid-cols-11 gap-6">
                  <div className="col-span-5">
                    <h3 className="text-lg font-medium mb-3">Deposit</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Minimum Deposit</span>
                        <span className="font-medium">
                          {brokerData.min_deposit ? `${brokerData.min_deposit}` : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
                        <span className="font-medium">
                          {brokerData.deposit_process_time || 'Varies by method'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fees</span>
                        <span className="font-medium">
                          {brokerData.deposit_fees === '0' || !brokerData.deposit_fees 
                            ? 'No fees' 
                            : brokerData.deposit_fees}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Methods</span>
                        <div className="text-right">
                          {brokerData.deposit_methods?.length ? (
                            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                              {brokerData.deposit_methods.map((method, index) => (
                                <span key={index} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{method}</span>                        
                              ))}
                            </div>
                          ) : 'N/A'}
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className='col-span-1'>
                    <div className='w-[50%] h-full flex items-center justify-center border-r border-black'></div>
                  </div>
                  <div className="col-span-5">
                    <h3 className="text-lg font-medium mb-3">Withdrawal</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Minimum Withdrawal</span>
                        <span className="font-medium">
                          {brokerData.min_withdrawl ? `${brokerData.min_withdrawl}` : 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
                        <span className="font-medium">
                          {brokerData.withdrawal_process_time || 'Varies by method'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fees</span>
                        <span className="font-medium">
                          {brokerData.withdrawal_fees === '0' || !brokerData.withdrawal_fees 
                            ? 'No fees' 
                            : brokerData.withdrawal_fees}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Methods</span>
                        <div className="text-right">
                          {brokerData.withdraw_methods?.length ? (
                            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                              {brokerData.withdraw_methods.map((method, idx) => (
                                <span key={idx} className="bg-white text-black px-2 mx-0.5 py-0.5 rounded text-xs font-medium border border-cyan-700" style={{borderRadius: '1.25rem'}}>{method}</span>
                              ))}
                            </div>
                          ) : 'N/A'}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pros & Cons */}
            <Card className={cn(
              "overflow-hidden relative",
              "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
              "backdrop-blur-sm",
              "border-0",
              "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
              "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
              "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
              "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
              "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
              "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
              "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
              "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
            )}>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 border-b border-black pb-2">Pros & Cons</h2>
                <div className="grid grid-cols-1 md:grid-cols-11 gap-6">
                  <div className="col-span-5">
                    <h3 className="text-lg font-medium mb-3 text-green-600 dark:text-green-400">Pros</h3>
                    <ul className="space-y-2">
                      {brokerData.pros?.length ? (
                        brokerData.pros.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))
                      ) : (
                        <li>No pros available</li>
                      )}
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <div className='w-[50%] h-full flex items-center justify-center border-r border-black'></div>
                  </div>
                  <div className="col-span-5">
                    <h3 className="text-lg font-medium mb-3 text-red-600 dark:text-red-400">Cons</h3>
                    <ul className="space-y-2">
                      {brokerData.cons?.length ? (
                        brokerData.cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))
                      ) : (
                        <li>No cons available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Broker Reviews Section */}
            <Card className={cn(
              "overflow-hidden relative mt-6",
              "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
              "backdrop-blur-sm",
              "border-0",
              "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
              "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
              "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
              "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
              "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
              "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
              "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
              "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
            )}>
              <div id="user_reviews" className="p-6">
                <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
                {/* Rating Filter */}
                <div className="mb-4 flex items-center gap-2">
                  <label htmlFor="rating-filter" className="font-medium">Filter by Rating:</label>
                  <select
                    id="rating-filter"
                    className="border rounded px-2 py-1"
                    value={selectedRating}
                    onChange={e => {
                      const v = e.target.value === 'All' ? 'All' : parseInt(e.target.value, 10) as 1|2|3|4|5;
                      setSelectedRating(v);
                      setVisibleReviews(3);
                    }}
                  >
                    <option value="All">All</option>
                    {[10,9,8,7,6,5,4,3,2,1].map(star => (
                      <option key={star} value={star}>{star} star{star > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                {/* Show reviews, loading state, or empty state */}
                {loadingReviews ? (
                  <div className="text-gray-400 text-center">Loading reviews...</div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {filteredReviews.slice(0, visibleReviews).map((review, idx) => {
                      // Type guard: user must have id (number|string) for voting
                      let userId: number | undefined = undefined;
                      if (user && (typeof (user as any).id === 'number' || typeof (user as any).id === 'string')) {
                        userId = typeof (user as any).id === 'number' ? (user as any).id : Number((user as any).id);
                      }
                      const reviewId = typeof review.id === 'number' ? review.id : (typeof review.id === 'string' ? Number(review.id) : undefined);
                      const votedUsers: number[] = Array.isArray(review.votes?.voted_users) ? review.votes.voted_users : [];
                      const userVoted = userId !== undefined && votedUsers.includes(userId);
                      const userUpvoted = !!(review.votes?.user_upvoted && userVoted);
                      const userDownvoted = !!(review.votes?.user_downvoted && userVoted);
                      const upvotes = typeof review.votes?.upvotes === 'number' ? review.votes.upvotes : 0;
                      const downvotes = typeof review.votes?.downvotes === 'number' ? review.votes.downvotes : 0;
                      async function handleVote(isUpvote: boolean) {
                        if (userId === undefined || reviewId === undefined) return;
                        try {
                          if (!userVoted) {
                            await insertReviewVote({ review_id: reviewId, user_id: userId, is_upvote: isUpvote });
                          } else if ((userUpvoted && isUpvote) || (userDownvoted && !isUpvote)) {
                            await deleteReviewVote({ review_id: reviewId, user_id: userId });
                          } else {
                            await updateReviewVote({ review_id: reviewId, user_id: userId, is_upvote: isUpvote });
                          }
                          await reloadReviews();
                        } catch (err) {
                          console.error('Vote error:', err);
                        }
                      }

                      return (
                        <div key={reviewId || idx} className="bg-white dark:bg-gray-900/80 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-800">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <UserCircle2 className="h-6 w-6 text-gray-400 mr-1" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-md text-gray-800 dark:text-gray-100">{review.name || 'Anonymous'}</span>
                                <span className="text-xs text-gray-400 flex items-center">
                                  {formatDateDMY(review.comment_at)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-2 md:mt-0">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className={cn(
                                  "h-4 w-4",
                                  parseFloat(review.rating) >= star ? "text-yellow-400 fill-current" : "text-gray-300"
                                )} />
                              ))}
                              <span className="ml-1 text-xs text-gray-500">{parseFloat(review.rating).toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="font-semibold text-md text-gray-700 dark:text-gray-200 mb-1">{review.title}</div>
                          <div className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">{review.content}</div>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded transition",
                                userUpvoted ? "bg-green-100 text-green-700 border border-green-400" : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-green-50"
                              )}
                              aria-pressed={userUpvoted}
                              title={userId ? (userUpvoted ? 'Remove upvote' : 'Upvote') : 'Login to vote'}
                              onClick={() => {
                                if (!user || !user.email_confirmed_at) {
                                  setOpen(true);
                                  return;
                                }
                                handleVote(true);
                              }}
                              type="button"
                            >
                              <ThumbsUp className={cn("w-4 h-4", userUpvoted ? "text-green-600" : "text-gray-400")} />
                              <span className="text-xs">{upvotes}</span>
                            </button>
                            <button
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded transition",
                                userDownvoted ? "bg-red-100 text-red-700 border border-red-400" : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-red-50"
                              )}
                              aria-pressed={userDownvoted}
                              title={userId ? (userDownvoted ? 'Remove downvote' : 'Downvote') : 'Login to vote'}
                              onClick={() => {
                                if (!user) {
                                  setOpen(true);
                                  return;
                                }
                                handleVote(false);
                              }}
                              type="button"
                            >
                              <ThumbsDown className={cn("w-4 h-4", userDownvoted ? "text-red-600" : "text-gray-400")} />
                              <span className="text-xs">{downvotes}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {visibleReviews < filteredReviews.length && (
                      <div className="flex justify-center mt-4">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => setVisibleReviews(v => Math.min(v + 3, reviews.length))}
                        >
                          View More
                        </button>
                      </div>
                    )}
                    {/* Review written form */}
                    <BrokerReviewForm brokerId={brokerData.id} onReviewSubmitted={() => { reloadReviews(); setVisibleReviews(3); }} onRequireLogin={() => setOpen(true)} />
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">No reviews available.</div>
                )}
              </div>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Rating */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Trust & Reliability
                    </span>
                    <span className="font-medium">{brokerData.rating ? (parseFloat(brokerData.rating) / 20).toFixed(2) : '—'} / 5</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${(parseFloat(brokerData.rating || '0') / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory information */}
            {brokerData.broker_licenses && brokerData.broker_licenses.length > 0 && (
              <Card 
                className={cn(
                  "overflow-hidden relative",
                  "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                  "backdrop-blur-sm",
                  "border-0",
                  "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                  "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                  "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                  "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                  "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                  "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                  "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                  "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
                )}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Regulatory</h3>
                  {brokerData.broker_licenses && brokerData.broker_licenses.length > 0 && (
                      <div className="rounded-xl flex flex-col">
                        <div className="flex flex-col gap-4 overflow-x-auto py-2 w-full rounded">
                          {brokerData.broker_licenses?.map((license, idx: number) => {
                            return (
                              <div 
                                key={'license' + idx} 
                                className="flex flex-col gap-2 px-4 py-2 cursor-pointer border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition duration-150 rounded w-full"
                                onClick={() => handleRegulatory(license)}
                              > 
                                <div className="flex flex-row">
                                  <span className="text-green-600 bg-green-100 px-2 rounded">
                                    {license.name}
                                  </span>
                                  {license.is_regulated && (
                                    <span className="text-green-600 px-2">Regulated</span>
                                  )} 
                                </div>
                                <div className="flex flex-row">
                                  <span>
                                    {license.regulated_by}
                                  </span>
                                  {license.is_regulated && (
                                    <span className="px-2">{license.license_type}</span>
                                  )} 
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
            
            {/* Broker Summary */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Broker Summary of {brokerData.name}</h3>
                <div className="space-y-2">
                  <div className="flex flex-col items-center mb-4">
                    {/* {brokerData.logo && (
                      <Image src={brokerData.logo} alt={brokerData.name} width={64} height={64} className="rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm mb-2" />
                    )} */}
                    {/* {brokerData.summary && (
                      <div className="text-gray-600 dark:text-gray-300 text-sm text-center mt-1">{brokerData.summary}</div>
                    )} */}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs text-left border border-gray-100 dark:border-gray-700 rounded-lg ">
                      <tbody>
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Founded</td>
                          <td>{brokerData.year_published || 'N/A'}</td>
                        </tr>
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Registered Country/Region</td>
                          <td>{brokerData.country || brokerData.headquarters || 'N/A'}</td>
                        </tr>
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Regulation</td>
                          <td>{brokerData.regulators && brokerData.regulators.length > 0 ? brokerData.regulators.join(', ') : 'N/A'}</td>
                        </tr>
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Licenses</td>
                          <td>{brokerData.licenses && brokerData.licenses.length > 0 ? brokerData.licenses.join(', ') : 'N/A'}</td>
                        </tr>
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Market Instruments</td>
                          <td>{brokerData.instruments && brokerData.instruments.length > 0 ? brokerData.instruments.join(', ') : 'N/A'}</td>
                        </tr>
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Demo Account</td>
                          <td>{brokerData.has_demo_account ? <CheckCircle className="inline w-4 h-4 text-emerald-500" /> : <X className="inline w-4 h-4 text-gray-400" />}</td>
                        </tr>
                        {/* <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Leverage</td>
                          <td>{brokerData.leverage_max || 'N/A'}</td>
                        </tr>
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Spread</td>
                          <td>{brokerData.spread_eur_usd || 'N/A'}</td>
                        </tr> */}
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Trading Platforms</td>
                          <td>{brokerData.platforms && brokerData.platforms.length > 0 ? brokerData.platforms.join(', ') : 'N/A'}</td>
                        </tr>
                        {/* <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Minimum Deposit</td>
                          <td>{brokerData.min_deposit || 'N/A'}</td>
                        </tr> */}
                        <tr className="border border-b-1 border-gray-400">
                          <td className="font-semibold py-1 pr-2 text-gray-700 dark:text-gray-200 border border-r-1 border-gray-400">Customer Support</td>
                          <td>{brokerData.availability ? brokerData.availability : 'N/A'}{brokerData.email ? <><br/>Email: {brokerData.email}</> : ''}{brokerData.phone_numbers && brokerData.phone_numbers.length > 0 ? <><br/>Phone: {brokerData.phone_numbers.join(', ')}</> : ''}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Brokers */}
            <Card 
              className={cn(
                "overflow-hidden relative",
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40",
                "backdrop-blur-sm",
                "border-0",
                "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                "before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:-z-10",
                "before:bg-gradient-to-br before:from-gray-300 before:via-gray-100 before:to-gray-400",
                "dark:before:from-gray-600 dark:before:via-gray-700 dark:before:to-gray-800",
                "after:absolute after:inset-0 after:p-[1px] after:rounded-lg after:-z-20",
                "after:bg-gradient-to-br after:from-black/20 after:via-black/10 after:to-transparent",
                "dark:after:from-black/30 dark:after:via-black/20 dark:after:to-transparent",
                "shadow-metallic hover:shadow-metallic-hover transition-all duration-300"
              )}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Similar Brokers</h3>
                <div className="space-y-4">
                  {relatedBrokers.map((broker: any) => (
                    <Link key={broker.id} href={`/broker/${broker.name ? broker.name.toLowerCase().replace(/\s+/g, '-') : broker.id}`}>
                      <div
                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                      >
                        <div className="h-14 w-14 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4 border border-gray-200 dark:border-gray-700">
                          {broker.logo ? (
                            <Image
                              src={broker.logo}
                              alt={broker.name}
                              width={40}
                              height={40}
                              className="h-14 w-14 object-contain rounded-lg"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                              <span className="text-xs font-medium text-gray-500">
                                {broker.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {broker.name}
                            </h4>
                            {typeof broker.rating !== 'undefined' && (
                              <div className="flex items-center ml-2">
                                <Star className="h-3.5 w-3.5 text-yellow-400 fill-current mr-0.5" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {brokerData.rating ? (parseFloat(brokerData.rating) / 20).toFixed(2) : '—'} / 5
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-1 flex items-center flex-wrap gap-1">
                            {broker.spread_eur_usd && (
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                Spread: {broker.spread_eur_usd}
                              </span>
                            )}
                            {broker.leverage_max && (
                              <span className="text-xs text-purple-600 dark:text-purple-400">
                                Leverage: {broker.leverage_max}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <LoginModal open={open} onClose={() => setOpen(false)} />
      <AiResultModal open={aiModalOpen} result={aiModalResult} getAiResult={aiGetResult} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
