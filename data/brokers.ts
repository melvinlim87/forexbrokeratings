export type BrokerLicence = {
  regulator: string;         // 'FCA'
  licenceNo: string;         // 'FRN 525164'
  entity: string;            // 'Trade Nation Financial UK Ltd'
  tier: '1' | '2' | '3';
};

export type Broker = {
  name: string;              // 'Trade Nation'
  primaryTier1: string[];    // ['FCA']
  otherLicences: BrokerLicence[];
  overallTier: '1' | '2' | '3' | 'Unregulated';
};

export const brokers: Broker[] = [
  {
    name: 'RS Finance',
    primaryTier1: [],
    otherLicences: [
      { regulator: 'ASIC', licenceNo: 'Unverified', entity: 'RS Finance Pty Ltd', tier: '2' }
    ],
    overallTier: 'Unregulated',
  },
  {
    name: 'FP Markets',
    primaryTier1: ['ASIC', 'CySEC'],
    otherLicences: [
      { regulator: 'FSCA', licenceNo: '50926', entity: 'FP Markets Pty Ltd', tier: '2' },
      { regulator: 'SVG', licenceNo: 'Registration', entity: 'FP Markets LLC', tier: '3' },
    ],
    overallTier: '1',
  },
  {
    name: 'FXCM',
    primaryTier1: ['FCA', 'ASIC'],
    otherLicences: [
      { regulator: 'FSCA', licenceNo: 'Entity', entity: 'FXCM South Africa (Pty) Ltd', tier: '2' },
    ],
    overallTier: '1',
  },
  {
    name: 'AIMS',
    primaryTier1: [],
    otherLicences: [
      { regulator: 'FSA Seychelles', licenceNo: 'SD xxx', entity: 'AIMS Markets Ltd', tier: '3' },
    ],
    overallTier: '3',
  },
  {
    name: 'IG',
    primaryTier1: ['FCA', 'BaFin', 'ASIC', 'NFA/CFTC'],
    otherLicences: [],
    overallTier: '1',
  },
  {
    name: 'XM',
    primaryTier1: ['CySEC', 'ASIC'],
    otherLicences: [
      { regulator: 'IFSC Belize', licenceNo: 'Entity', entity: 'XM Global Limited', tier: '3' },
      { regulator: 'DFSA', licenceNo: 'Entity', entity: 'Trading Point MENA Limited', tier: '2' },
    ],
    overallTier: '1',
  },
  {
    name: 'IC Markets Global',
    primaryTier1: [],
    otherLicences: [
      { regulator: 'FSA Seychelles', licenceNo: 'SD018', entity: 'Raw Trading Ltd', tier: '3' },
    ],
    overallTier: '3',
  },
  {
    name: 'AvaTrade',
    primaryTier1: ['CBI', 'ASIC', 'JFSA', 'ADGM FSRA'],
    otherLicences: [
      { regulator: 'FSCA', licenceNo: '45984', entity: 'Ava Capital Markets Pty Ltd', tier: '2' },
    ],
    overallTier: '1',
  },
  {
    name: 'STARTRADER',
    primaryTier1: [],
    otherLicences: [
      { regulator: 'FSCA', licenceNo: '52464', entity: 'STARTRADER (PTY) LTD', tier: '2' },
    ],
    overallTier: '2',
  },
  {
    name: 'Trade Nation',
    primaryTier1: ['FCA', 'ASIC'],
    otherLicences: [
      { regulator: 'FSCA', licenceNo: '49846', entity: 'Trade Nation Financial South Africa (Pty) Ltd', tier: '2' },
      { regulator: 'SCB', licenceNo: 'SIA-F216', entity: 'Trade Nation Ltd Bahamas', tier: '2' },
      { regulator: 'FSA Seychelles', licenceNo: 'SD150', entity: 'Trade Nation Ltd Seychelles', tier: '3' },
    ],
    overallTier: '1',
  },
];
