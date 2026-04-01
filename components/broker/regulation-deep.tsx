"use client";

import { Shield, ExternalLink, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EntityRegulation {
  name: string;
  status: 'regulated' | 'restricted' | 'revoked';
  licenseType: string;
  licenseNumber: string;
  regulator: string;
  country: string;
  countriesServed?: string[];
  leverageLimit?: string;
  depositProtection?: string;
  regulatoryHistory?: { date: string; event: string; type: 'fine' | 'warning' | 'approval' }[];
}

interface RegulationDeepProps {
  entities: EntityRegulation[];
  brokerName: string;
}

const REGULATOR_URLS: Record<string, string> = {
  FCA: 'https://register.fca.org.uk/s/',
  ASIC: 'https://connectonline.asic.gov.au/RegistrySearch/faces/landing/SearchRegisters.jspx',
  CySEC: 'https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/',
  BaFin: 'https://www.bafin.de/EN/PublikationenDaten/Datenbanken/datenbank_node_en.html',
  DFSA: 'https://www.dfsa.ae/firms/regulated-firms',
  FSCA: 'https://www.fsca.co.za/Regulated-Entities',
  MAS: 'https://eservices.mas.gov.sg/fid',
  CFTC: 'https://www.nfa.futures.org/basicnet/',
  FINMA: 'https://www.finma.ch/en/authorisation/finma-authorised-institutions/',
  JFSA: 'https://www.fsa.go.jp/en/mediation/search.html',
  FMA: 'https://www.fma.govt.nz/compliance/registers/',
  SCB: 'https://www.scb.gov.bs/regulatory-registers',
  FSA: 'https://fsaseychelles.sc/',
  SEC: 'https://www.sec.gov/cgi-bin/browse-edgar',
  IIROC: 'https://www.iiroc.ca/investors/members-directory',
  CBI: 'https://registers.centralbank.ie/FirmRegisters/SearchPage',
  SFC: 'https://www.sfc.hk/publicregWeb/searchByName',
  CMA: 'https://www.cma.or.ke/',
  VFSC: 'https://www.vfsc.vu/',
  IFSC: 'https://www.ifsc.bz/',
  CIMA: 'https://www.cima.ky/search',
};

function getStatusIcon(status: EntityRegulation['status']) {
  switch (status) {
    case 'regulated':
      return <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />;
    case 'restricted':
      return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
    case 'revoked':
      return <XCircle className="h-3.5 w-3.5 text-red-400" />;
  }
}

function getStatusColor(status: EntityRegulation['status']) {
  switch (status) {
    case 'regulated': return 'text-emerald-400';
    case 'restricted': return 'text-amber-400';
    case 'revoked': return 'text-red-400';
  }
}

export function RegulationDeep({ entities, brokerName }: RegulationDeepProps) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
      {/* Compact Header */}
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-4 w-4 text-emerald-400" />
        <h3 className="text-base font-semibold text-white">Regulation & Licensing</h3>
        <span className="text-base text-gray-500">({entities.length} {entities.length === 1 ? 'entity' : 'entities'})</span>
      </div>

      {/* Compact Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-1.5 px-2 text-gray-500 font-medium">Entity</th>
              <th className="text-left py-1.5 px-2 text-gray-500 font-medium">Regulator</th>
              <th className="text-left py-1.5 px-2 text-gray-500 font-medium">License</th>
              <th className="text-left py-1.5 px-2 text-gray-500 font-medium">Status</th>
              <th className="text-left py-1.5 px-2 text-gray-500 font-medium">Protection</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity, idx) => {
              const regulatorUrl = REGULATOR_URLS[entity.regulator];

              return (
                <tr key={idx} className="border-b border-gray-800/30 hover:bg-gray-800/20">
                  {/* Entity + Country */}
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-white whitespace-nowrap">{entity.name}</span>
                      <span className="text-lg mr-1">{(entity as any).flag || ''}</span>
                      <span className="text-[10px] bg-gray-700/50 text-gray-400 px-1 py-0.5 rounded">{entity.country}</span>
                    </div>
                  </td>
                  {/* Regulator */}
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-medium">{entity.regulator}</span>
                      {regulatorUrl && (
                        <a href={regulatorUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  {/* License */}
                  <td className="py-1.5 px-2 text-gray-300 font-mono">{entity.licenseNumber}</td>
                  {/* Status */}
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(entity.status)}
                      <span className={`text-base font-medium ${getStatusColor(entity.status)}`}>
                        {entity.status === 'regulated' ? 'Regulated' : entity.status === 'restricted' ? 'Restricted' : 'Revoked'}
                      </span>
                    </div>
                  </td>
                  {/* Leverage / Protection */}
                  <td className="py-1.5 px-2 text-gray-400">
                    {entity.leverageLimit && <span>{entity.leverageLimit}</span>}
                    {entity.leverageLimit && entity.depositProtection && <span className="text-gray-600 mx-1">·</span>}
                    {entity.depositProtection && <span className="text-blue-400">{entity.depositProtection}</span>}
                    {!entity.leverageLimit && !entity.depositProtection && <span className="text-gray-600">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Regulatory History (collapsed by default, shown inline) */}
      {entities.some(e => e.regulatoryHistory && e.regulatoryHistory.length > 0) && (
        <div className="mt-2 pt-2 border-t border-gray-800/30">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Regulatory History</div>
          <div className="flex flex-wrap gap-2">
            {entities.flatMap(e => e.regulatoryHistory || []).map((event, i) => (
              <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                event.type === 'fine' ? 'bg-red-500/15 text-red-400' :
                event.type === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                'bg-emerald-500/15 text-emerald-400'
              }`}>
                {event.date} {event.type}: {event.event}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
