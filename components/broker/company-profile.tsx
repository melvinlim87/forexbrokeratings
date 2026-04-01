"use client";

import { Building2, MapPin, Calendar, Users, Globe, Briefcase, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CompanyProfileData {
  name: string;
  founded: string;
  headquarters: string;
  parentCompany: string;
  phone?: string;
  email?: string;
  website?: string;
  employees?: string;
  businessType?: string;
  publiclyTraded?: { exchange: string; ticker: string };
  businessCategories?: string[];
  tradingInstruments?: string[];
  baseCurrencies?: string[];
  supportedRegions?: string[];
  restrictedRegions?: string[];
}

interface CompanyProfileProps {
  data: CompanyProfileData;
}

export function CompanyProfile({ data }: CompanyProfileProps) {
  const yearsActive = new Date().getFullYear() - parseInt(data.founded);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
      {/* Compact Header */}
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="h-4 w-4 text-blue-400" />
        <h3 className="text-base font-semibold text-white">Company Profile</h3>
      </div>

      {/* Key Facts — inline row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-base mb-2 pb-2 border-b border-gray-800/30">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-blue-400" />
          <span className="text-gray-500">Founded:</span>
          <span className="text-white font-medium">{data.founded}</span>
          <span className="text-gray-500">({yearsActive}yr)</span>
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-blue-400" />
          <span className="text-gray-500">HQ:</span>
          <span className="text-white font-medium">{data.headquarters}</span>
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3 w-3 text-blue-400" />
          <span className="text-gray-500">Type:</span>
          <span className="text-white font-medium">{data.businessType || 'Broker'}</span>
        </span>
        {data.employees && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-400" />
            <span className="text-gray-500">Staff:</span>
            <span className="text-white font-medium">{data.employees}</span>
          </span>
        )}
      </div>

      {/* Parent Company + Public Listing — compact */}
      {data.parentCompany && (
        <div className="text-base mb-2">
          <span className="text-gray-500">Parent:</span>
          <span className="text-white ml-1">{data.parentCompany}</span>
          {data.publiclyTraded && (
            <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              {data.publiclyTraded.exchange}:{data.publiclyTraded.ticker}
            </span>
          )}
        </div>
      )}

      {/* Currencies — inline */}
      {data.baseCurrencies && data.baseCurrencies.length > 0 && (
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-[10px] text-gray-500 uppercase">Currencies:</span>
          {data.baseCurrencies.map((cur, i) => (
            <span key={i} className="text-[10px] bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded font-mono">{cur}</span>
          ))}
        </div>
      )}

      {/* Regions — compact inline */}
      <div className="flex flex-wrap gap-2">
        {data.supportedRegions && data.supportedRegions.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-emerald-500 uppercase">✓</span>
            <div className="flex flex-wrap gap-1">
              {data.supportedRegions.slice(0, 6).map((r, i) => (
                <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded">{r}</span>
              ))}
              {data.supportedRegions.length > 6 && <span className="text-[10px] text-gray-500">+{data.supportedRegions.length - 6}</span>}
            </div>
          </div>
        )}
        {data.restrictedRegions && data.restrictedRegions.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-red-500 uppercase">✗</span>
            <div className="flex flex-wrap gap-1">
              {data.restrictedRegions.slice(0, 4).map((r, i) => (
                <span key={i} className="text-[10px] bg-red-500/10 text-red-400 px-1 py-0.5 rounded">{r}</span>
              ))}
              {data.restrictedRegions.length > 4 && <span className="text-[10px] text-gray-500">+{data.restrictedRegions.length - 4}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Contact — inline */}
      {(data.phone || data.email || data.website) && (
        <div className="mt-2 pt-1.5 border-t border-gray-800/30 flex flex-wrap gap-3 text-base text-gray-400">
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {data.phone}
            </span>
          )}
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {data.email}
            </span>
          )}
          {data.website && (
            <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
              <Globe className="h-3 w-3" />
              Website
            </a>
          )}
        </div>
      )}
    </div>
  );
}
