'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Star, 
  Shield, 
  Globe, 
  Award,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  Briefcase,
  CreditCard,
  FileText,
  Settings,
  Lock,
  Smartphone,
  Monitor,
  Headphones,
  BookOpen,
  Calendar,
  Building,
  Cpu,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

const rsFinanceData = {
  basic: {
    name: "RS Finance",
    logo: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    rating: 4.8,
    established: 2018,
    headquarters: "Seychelles",
    website: "https://www.rsfinance.com",
    email: "support@rsfinance.com",
    phone: "+248 4 671 948",
    operatingPeriod: "6+ years",
    companyName: "RS Finance Limited",
    registrationNumber: "8429991-1",
    environment: "AA"
  },
  scores: {
    licenses: 8.36,
    tradingEnvironment: 9.10,
    riskControl: 9.92,
    customerSupport: 9.99,
    technology: 8.88,
    overall: 9.25
  },
  regulation: {
    regulators: [
      {
        name: "FSA",
        fullName: "Financial Services Authority",
        country: "Seychelles",
        license: "SD2023",
        status: "Active",
        clientProtection: "Segregated Funds"
      },
      {
        name: "CySEC",
        fullName: "Cyprus Securities and Exchange Commission",
        country: "Cyprus",
        license: "CIF 371/18",
        status: "Active",
        clientProtection: "Investor Compensation Fund"
      }
    ],
    clientProtection: [
      "Segregated client funds",
      "Negative balance protection",
      "Professional indemnity insurance",
      "Regulatory oversight",
      "Dispute resolution mechanism"
    ],
    riskLevel: "Medium",
    complianceScore: 8.5
  },
  trading: {
    platforms: [
      {
        name: "MetaTrader 4",
        type: "Desktop/Mobile/Web",
        features: ["Expert Advisors", "Custom Indicators", "One-Click Trading"]
      },
      {
        name: "MetaTrader 5",
        type: "Desktop/Mobile/Web", 
        features: ["Advanced Charting", "Economic Calendar", "Market Depth"]
      },
      {
        name: "RS WebTrader",
        type: "Web-based",
        features: ["No Download Required", "Cross-Platform", "Real-time Data"]
      }
    ],
    accountTypes: [
      {
        name: "Standard",
        minDeposit: 250,
        maxLeverage: "1:400",
        minSpread: "1.2 pips",
        commission: "No commission",
        features: ["Fixed spreads", "No requotes", "24/7 support"]
      },
      {
        name: "ECN",
        minDeposit: 1000,
        maxLeverage: "1:200",
        minSpread: "0.1 pips",
        commission: "$3.5 per lot",
        features: ["Raw spreads", "Market execution", "Deep liquidity"]
      },
      {
        name: "VIP",
        minDeposit: 10000,
        maxLeverage: "1:500",
        minSpread: "0.0 pips",
        commission: "$2.5 per lot",
        features: ["Tightest spreads", "Priority support", "Personal manager"]
      }
    ],
    instruments: {
      forex: 65,
      indices: 12,
      commodities: 8,
      cryptocurrencies: 15,
      stocks: 150
    },
    executionSpeed: "0.8ms",
    maxLeverage: "1:500",
    minDeposit: 250,
    averageTransactionSpeed: "384ms"
  },
  promotions: {
    welcomeBonus: {
      title: "$1,000 Cash Bonus",
      description: "Progressive bonus based on deposit amount and trading volume",
      tiers: [
        {
          deposit: 2000,
          rate: "Every 10 lots = $250",
          maxBonus: 1000
        },
        {
          deposit: 5000,
          rate: "Every 5 lots = $250", 
          maxBonus: 1000
        },
        {
          deposit: 20000,
          rate: "Every 2.5 lots = $250",
          maxBonus: 1000
        }
      ],
      terms: "New clients only. Bonus earned progressively based on trading volume."
    },
    otherOffers: [
      "Free VPS hosting for deposits above $5,000",
      "Cashback program for active traders",
      "Educational webinars and courses",
      "Trading competitions with prizes"
    ]
  },
  paymentMethods: {
    deposit: [
      "Bank Wire Transfer",
      "Credit/Debit Cards (Visa, MasterCard)",
      "Skrill",
      "Neteller",
      "Perfect Money",
      "Cryptocurrency (Bitcoin, Ethereum)"
    ],
    withdrawal: [
      "Bank Wire Transfer",
      "Credit/Debit Cards",
      "Skrill", 
      "Neteller",
      "Perfect Money",
      "Cryptocurrency"
    ],
    processingTime: {
      deposit: "Instant - 24 hours",
      withdrawal: "1-3 business days"
    },
    fees: {
      deposit: "Free (except bank wire: $25)",
      withdrawal: "Free for amounts above $100"
    }
  },
  support: {
    availability: "24/7",
    languages: ["English", "Spanish", "French", "German", "Italian", "Portuguese"],
    channels: [
      {
        type: "Live Chat",
        availability: "24/7",
        responseTime: "< 1 minute"
      },
      {
        type: "Email",
        availability: "24/7", 
        responseTime: "< 4 hours"
      },
      {
        type: "Phone",
        availability: "24/5",
        responseTime: "Immediate"
      }
    ],
    education: [
      "Trading Academy",
      "Video Tutorials",
      "Webinars",
      "Market Analysis",
      "Economic Calendar",
      "Trading Signals"
    ]
  },
  performance: {
    executionRate: "99.8%",
    averageSpread: "1.2 pips",
    slippage: "Minimal",
    uptime: "99.9%",
    clientSatisfaction: "4.8/5",
    withdrawalSuccess: "99.5%"
  }
};

// Pentagon Chart Component
const PentagonChart = ({ scores }: { scores: any }) => {
  const dimensions = [
    { name: 'Licenses', value: scores.licenses, angle: 0 },
    { name: 'Trading Environment', value: scores.tradingEnvironment, angle: 72 },
    { name: 'Risk Control', value: scores.riskControl, angle: 144 },
    { name: 'Customer Support', value: scores.customerSupport, angle: 216 },
    { name: 'Technology', value: scores.technology, angle: 288 }
  ];

  const size = 200;
  const center = size / 2;
  const maxRadius = 80;

  // Create pentagon points for background
  const pentagonPoints = dimensions.map(dim => {
    const angle = (dim.angle - 90) * (Math.PI / 180);
    const x = center + maxRadius * Math.cos(angle);
    const y = center + maxRadius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Create score polygon
  const scorePoints = dimensions.map(dim => {
    const angle = (dim.angle - 90) * (Math.PI / 180);
    const radius = (dim.value / 10) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative">
      <svg width={size} height={size} className="mx-auto">
        {/* Background grid circles */}
        {[2, 4, 6, 8, 10].map(level => (
          <polygon
            key={level}
            points={dimensions.map(dim => {
              const angle = (dim.angle - 90) * (Math.PI / 180);
              const radius = (level / 10) * maxRadius;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Grid lines */}
        {dimensions.map((dim, index) => (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos((dim.angle - 90) * (Math.PI / 180))}
            y2={center + maxRadius * Math.sin((dim.angle - 90) * (Math.PI / 180))}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Score polygon */}
        <polygon
          points={scorePoints}
          fill="rgba(34, 197, 244, 0.2)"
          stroke="rgb(34, 197, 244)"
          strokeWidth="2"
        />

        {/* Score points */}
        {dimensions.map((dim, index) => {
          const angle = (dim.angle - 90) * (Math.PI / 180);
          const radius = (dim.value / 10) * maxRadius;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="rgb(34, 197, 244)"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Labels */}
      <div className="absolute inset-0">
        {dimensions.map((dim, index) => {
          const angle = (dim.angle - 90) * (Math.PI / 180);
          const labelRadius = maxRadius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          
          return (
            <div
              key={index}
              className="absolute text-xs text-white font-medium text-center"
              style={{
                left: x - 40,
                top: y - 10,
                width: 80,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div>{dim.name}</div>
              <div className="text-cyan-400 font-bold">{dim.value}</div>
            </div>
          );
        })}
      </div>

      {/* Center score */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{scores.overall}</div>
          <div className="text-xs text-cyan-200">Overall</div>
        </div>
      </div>
    </div>
  );
};

export default function RSFinancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Broker Logo and Basic Info */}
            <div className="flex flex-col lg:flex-row items-center justify-center mb-8 gap-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-cyan-400/30 mb-6 md:mb-0 md:mr-8">
                  <Image
                    src={rsFinanceData.basic.logo}
                    alt="RS Finance Logo"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1 mr-4">
                      Regulated
                    </Badge>
                    <div className="flex items-center">
                      <img src="https://flagcdn.com/w20/sc.png" alt="Seychelles" className="w-5 h-3 mr-2" />
                      <span className="text-cyan-200">Seychelles | Above 20 years</span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {rsFinanceData.basic.name}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <span className="text-lg text-cyan-200 mr-4">Environment {rsFinanceData.basic.environment}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(rsFinanceData.basic.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                        />
                      ))}
                      <span className="ml-2 text-lg text-cyan-200 font-semibold">{rsFinanceData.basic.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    <span className="text-cyan-200">XAU/GC</span>
                    <span className="text-cyan-200">Crypto</span>
                    <span className="text-cyan-200">Regulated in Australia</span>
                  </div>
                </div>
              </div>

              {/* Rating Index Pentagon */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <h3 className="text-white font-semibold mb-2 flex items-center justify-center">
                    <Info className="w-4 h-4 mr-2" />
                    Rating Index
                  </h3>
                </div>
                <PentagonChart scores={rsFinanceData.scores} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{rsFinanceData.basic.operatingPeriod}</div>
                <div className="text-cyan-200 text-sm">Operating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-purple-400 mb-1">{rsFinanceData.trading.maxLeverage}</div>
                <div className="text-cyan-200 text-sm">Max Leverage</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-green-400 mb-1">${rsFinanceData.trading.minDeposit}</div>
                <div className="text-cyan-200 text-sm">Min Deposit</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{rsFinanceData.trading.executionSpeed}</div>
                <div className="text-cyan-200 text-sm">Execution Speed</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Open Account
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Time Machine
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
          
          {/* Company Overview & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Information */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Building className="w-6 h-6 mr-3 text-cyan-400" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/60 text-sm">Company Name:</span>
                    <div className="text-white font-medium">{rsFinanceData.basic.companyName}</div>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Registration:</span>
                    <div className="text-white font-medium">{rsFinanceData.basic.registrationNumber}</div>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Headquarters:</span>
                    <div className="text-white font-medium">{rsFinanceData.basic.headquarters}</div>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Established:</span>
                    <div className="text-white font-medium">{rsFinanceData.basic.established}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-cyan-200">
                      <Globe className="w-4 h-4 mr-3" />
                      <a href={rsFinanceData.basic.website} className="hover:text-cyan-300 transition-colors">
                        {rsFinanceData.basic.website}
                      </a>
                    </div>
                    <div className="flex items-center text-cyan-200">
                      <Mail className="w-4 h-4 mr-3" />
                      {rsFinanceData.basic.email}
                    </div>
                    <div className="flex items-center text-cyan-200">
                      <Phone className="w-4 h-4 mr-3" />
                      {rsFinanceData.basic.phone}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-6 h-6 mr-3 text-green-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{rsFinanceData.performance.executionRate}</div>
                    <div className="text-green-200 text-sm">Execution Rate</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">{rsFinanceData.performance.uptime}</div>
                    <div className="text-blue-200 text-sm">Uptime</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400">{rsFinanceData.performance.averageSpread}</div>
                    <div className="text-purple-200 text-sm">Avg Spread</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="text-2xl font-bold text-yellow-400">{rsFinanceData.performance.clientSatisfaction}</div>
                    <div className="text-yellow-200 text-sm">Client Rating</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60">Environment:</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {rsFinanceData.basic.environment}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60">Average Transaction Speed:</span>
                    <span className="text-green-400 font-bold">{rsFinanceData.trading.averageTransactionSpeed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">MT4/5 License:</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Full License
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Instruments */}
          <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-cyan-400" />
                Trading Instruments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">{rsFinanceData.trading.instruments.forex}</div>
                  <div className="text-cyan-200 text-sm">Forex Pairs</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{rsFinanceData.trading.instruments.indices}</div>
                  <div className="text-purple-200 text-sm">Indices</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{rsFinanceData.trading.instruments.commodities}</div>
                  <div className="text-yellow-200 text-sm">Commodities</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-400">{rsFinanceData.trading.instruments.cryptocurrencies}</div>
                  <div className="text-green-200 text-sm">Crypto</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-red-400">{rsFinanceData.trading.instruments.stocks}</div>
                  <div className="text-red-200 text-sm">Stocks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regulation & Client Protection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Regulatory Bodies */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-green-400" />
                  Regulatory Licenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rsFinanceData.regulation.regulators.map((regulator, index) => (
                  <div key={index} className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{regulator.name}</h4>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {regulator.status}
                      </Badge>
                    </div>
                    <p className="text-green-200 text-sm mb-2">{regulator.fullName}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-white/60">License:</span>
                        <div className="text-white">{regulator.license}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Country:</span>
                        <div className="text-white">{regulator.country}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-white/60 text-sm">Protection:</span>
                      <div className="text-green-300 text-sm">{regulator.clientProtection}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Client Protection */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-blue-400" />
                  Client Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Risk Level</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      {rsFinanceData.regulation.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Compliance Score</span>
                    <span className="text-green-400 font-bold">{rsFinanceData.regulation.complianceScore}/10</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-3">Protection Measures</h4>
                  <div className="space-y-2">
                    {rsFinanceData.regulation.clientProtection.map((protection, index) => (
                      <div key={index} className="flex items-center text-cyan-200">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        {protection}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Platforms */}
          <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Monitor className="w-6 h-6 mr-3 text-cyan-400" />
                Trading Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rsFinanceData.trading.platforms.map((platform, index) => (
                  <div key={index} className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <h4 className="text-white font-semibold mb-2">{platform.name}</h4>
                    <p className="text-cyan-200 text-sm mb-3">{platform.type}</p>
                    <div className="space-y-1">
                      {platform.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-cyan-200">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Types */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Account <span className="text-cyan-400">Types</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rsFinanceData.trading.accountTypes.map((account, index) => (
                <Card key={index} className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{account.name}</span>
                      {account.name === 'VIP' && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-500/10 rounded-lg">
                        <div className="text-lg font-bold text-green-400">${account.minDeposit}</div>
                        <div className="text-green-200 text-xs">Min Deposit</div>
                      </div>
                      <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">{account.maxLeverage}</div>
                        <div className="text-purple-200 text-xs">Max Leverage</div>
                      </div>
                      <div className="text-center p-3 bg-cyan-500/10 rounded-lg">
                        <div className="text-lg font-bold text-cyan-400">{account.minSpread}</div>
                        <div className="text-cyan-200 text-xs">Min Spread</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                        <div className="text-lg font-bold text-yellow-400">{account.commission}</div>
                        <div className="text-yellow-200 text-xs">Commission</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2">Features</h4>
                      <div className="space-y-1">
                        {account.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-cyan-200">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                      Open {account.name} Account
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Deposit Methods */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-green-400" />
                  Deposit Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rsFinanceData.paymentMethods.deposit.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="text-white">{method}</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      Available
                    </Badge>
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Processing Time:</span>
                    <span className="text-green-400">{rsFinanceData.paymentMethods.processingTime.deposit}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-white/60">Fees:</span>
                    <span className="text-green-400">{rsFinanceData.paymentMethods.fees.deposit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Methods */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-6 h-6 mr-3 text-blue-400" />
                  Withdrawal Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rsFinanceData.paymentMethods.withdrawal.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <span className="text-white">{method}</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      Available
                    </Badge>
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Processing Time:</span>
                    <span className="text-blue-400">{rsFinanceData.paymentMethods.processingTime.withdrawal}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-white/60">Fees:</span>
                    <span className="text-blue-400">{rsFinanceData.paymentMethods.fees.withdrawal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Support & Education */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Support */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Headphones className="w-6 h-6 mr-3 text-cyan-400" />
                  Customer Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-cyan-500/10 rounded-lg">
                    <div className="text-lg font-bold text-cyan-400">{rsFinanceData.support.availability}</div>
                    <div className="text-cyan-200 text-xs">Availability</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">{rsFinanceData.support.languages.length}</div>
                    <div className="text-purple-200 text-xs">Languages</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {rsFinanceData.support.channels.map((channel, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{channel.type}</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                          {channel.availability}
                        </Badge>
                      </div>
                      <div className="text-cyan-200 text-sm">Response: {channel.responseTime}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education & Resources */}
            <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-green-400" />
                  Education & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rsFinanceData.support.education.map((resource, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-white">{resource}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border-cyan-400/30 max-w-4xl mx-auto">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-cyan-400 mr-3" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    Ready to Start Trading with RS Finance?
                  </h3>
                </div>
                <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of traders who trust RS Finance for their forex trading needs. 
                  Get started with competitive spreads and professional support.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Open Live Account
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    Try Demo Account
                  </Button>
                </div>
                <p className="text-cyan-200 text-sm mt-6">
                  Risk Warning: Trading involves substantial risk and may not be suitable for all investors.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}