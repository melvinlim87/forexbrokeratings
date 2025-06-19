export interface ComparisonBroker {
  id: string;
  name: string;
  logo: string;
  overview: {
    rating: number;
    minSpread: string;
    maxLeverage: string;
    minDeposit: number;
    established: number;
    regulatedBy: string[];
  };
  ratings: {
    overall: number;
    spreads: number;
    execution: number;
    platform: number;
    support: number;
  };
  promotions: {
    welcomeBonus: string;
    depositBonus: string;
    specialOffers: string[];
  };
  regulations: {
    regulators: string[];
    licenses: string[];
    clientProtection: string[];
  };
  riskControl: {
    level: string;
    measures: string[];
    score: number;
  };
  trading: {
    platforms: string[];
    assets: number;
    executionSpeed: string;
    riskLevel: string;
  };
}

export const comparisonBrokers: ComparisonBroker[] = [
  {
    id: "ic-markets",
    name: "IC Markets",
    logo: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 9.6,
      minSpread: "0.0 pips",
      maxLeverage: "1:500",
      minDeposit: 200,
      established: 2007,
      regulatedBy: ["ASIC", "CySEC", "FSA"]
    },
    ratings: {
      overall: 9.6,
      spreads: 9.8,
      execution: 9.7,
      platform: 9.4,
      support: 9.2
    },
    promotions: {
      welcomeBonus: "No welcome bonus",
      depositBonus: "No deposit bonus",
      specialOffers: ["Free VPS hosting", "Rebate program", "Educational resources"]
    },
    regulations: {
      regulators: ["ASIC", "CySEC", "FSA", "FSCA"],
      licenses: ["AFSL 335692", "CIF 362/18", "SD076"],
      clientProtection: ["Segregated funds", "Negative balance protection", "Investor compensation"]
    },
    riskControl: {
      level: "Low",
      measures: ["Real-time risk monitoring", "Automated stop-outs", "Margin call alerts"],
      score: 9.5
    },
    trading: {
      platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader"],
      assets: 232,
      executionSpeed: "0.4ms",
      riskLevel: "Low"
    }
  },
  {
    id: "fp-markets",
    name: "FP Markets",
    logo: "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 9.4,
      minSpread: "0.1 pips",
      maxLeverage: "1:500",
      minDeposit: 100,
      established: 2005,
      regulatedBy: ["ASIC", "CySEC"]
    },
    ratings: {
      overall: 9.4,
      spreads: 9.3,
      execution: 9.5,
      platform: 9.6,
      support: 9.1
    },
    promotions: {
      welcomeBonus: "Free VPS hosting",
      depositBonus: "No deposit bonus",
      specialOffers: ["Copy trading", "Trading signals", "Market analysis"]
    },
    regulations: {
      regulators: ["ASIC", "CySEC", "FSCA", "SVG FSA"],
      licenses: ["AFSL 286354", "CIF 371/18"],
      clientProtection: ["Segregated funds", "Professional indemnity insurance", "Compensation scheme"]
    },
    riskControl: {
      level: "Low",
      measures: ["Advanced risk management", "Position monitoring", "Automated alerts"],
      score: 9.3
    },
    trading: {
      platforms: ["MetaTrader 4", "MetaTrader 5", "IRESS"],
      assets: 10000,
      executionSpeed: "0.6ms",
      riskLevel: "Low"
    }
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    logo: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 9.2,
      minSpread: "0.0 pips",
      maxLeverage: "1:400",
      minDeposit: 0,
      established: 2010,
      regulatedBy: ["ASIC", "FCA", "CySEC", "BaFin"]
    },
    ratings: {
      overall: 9.2,
      spreads: 9.4,
      execution: 9.3,
      platform: 9.5,
      support: 8.9
    },
    promotions: {
      welcomeBonus: "No welcome bonus",
      depositBonus: "No deposit bonus",
      specialOffers: ["Smart Trader Tools", "TradingView integration", "Social trading"]
    },
    regulations: {
      regulators: ["ASIC", "FCA", "CySEC", "BaFin", "FSCA"],
      licenses: ["AFSL 414530", "FRN 684312", "CIF 388/20"],
      clientProtection: ["FSCS protection", "Segregated accounts", "Negative balance protection"]
    },
    riskControl: {
      level: "Low",
      measures: ["Real-time monitoring", "Risk alerts", "Position limits"],
      score: 9.1
    },
    trading: {
      platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView"],
      assets: 1200,
      executionSpeed: "0.5ms",
      riskLevel: "Low"
    }
  },
  {
    id: "xm-group",
    name: "XM Group",
    logo: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 9.0,
      minSpread: "1.0 pips",
      maxLeverage: "1:888",
      minDeposit: 5,
      established: 2009,
      regulatedBy: ["CySEC", "IFSC", "ASIC"]
    },
    ratings: {
      overall: 9.0,
      spreads: 8.5,
      execution: 8.8,
      platform: 9.2,
      support: 9.5
    },
    promotions: {
      welcomeBonus: "$30 no deposit bonus",
      depositBonus: "Up to $5,000 deposit bonus",
      specialOffers: ["Loyalty program", "Trading competitions", "Educational webinars"]
    },
    regulations: {
      regulators: ["CySEC", "IFSC", "ASIC", "FSA"],
      licenses: ["CIF 120/10", "IFSC/60/354/TS/18", "AFSL 443670"],
      clientProtection: ["Segregated funds", "Investor compensation", "Negative balance protection"]
    },
    riskControl: {
      level: "Medium",
      measures: ["Risk management tools", "Stop loss orders", "Margin monitoring"],
      score: 8.7
    },
    trading: {
      platforms: ["MetaTrader 4", "MetaTrader 5"],
      assets: 1000,
      executionSpeed: "1.2ms",
      riskLevel: "Medium"
    }
  },
  {
    id: "oanda",
    name: "OANDA",
    logo: "https://images.pexels.com/photos/8370421/pexels-photo-8370421.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 8.8,
      minSpread: "0.8 pips",
      maxLeverage: "1:50",
      minDeposit: 0,
      established: 1996,
      regulatedBy: ["CFTC", "NFA", "FCA", "ASIC"]
    },
    ratings: {
      overall: 8.8,
      spreads: 8.6,
      execution: 9.0,
      platform: 8.9,
      support: 8.7
    },
    promotions: {
      welcomeBonus: "No welcome bonus",
      depositBonus: "No deposit bonus",
      specialOffers: ["Advanced charting", "API access", "Educational resources"]
    },
    regulations: {
      regulators: ["CFTC", "NFA", "FCA", "ASIC", "IIROC", "MAS"],
      licenses: ["NFA ID: 0325821", "FRN 542574", "AFSL 412981"],
      clientProtection: ["SIPC protection", "Segregated funds", "Regulatory oversight"]
    },
    riskControl: {
      level: "Low",
      measures: ["Conservative leverage", "Risk disclosure", "Educational resources"],
      score: 9.2
    },
    trading: {
      platforms: ["OANDA Trade", "MetaTrader 4", "TradingView"],
      assets: 68,
      executionSpeed: "0.8ms",
      riskLevel: "Low"
    }
  },
  {
    id: "forex-com",
    name: "Forex.com",
    logo: "https://images.pexels.com/photos/7413892/pexels-photo-7413892.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 8.6,
      minSpread: "0.8 pips",
      maxLeverage: "1:50",
      minDeposit: 100,
      established: 2001,
      regulatedBy: ["CFTC", "NFA", "FCA"]
    },
    ratings: {
      overall: 8.6,
      spreads: 8.4,
      execution: 8.8,
      platform: 8.7,
      support: 8.5
    },
    promotions: {
      welcomeBonus: "No welcome bonus",
      depositBonus: "No deposit bonus",
      specialOffers: ["Advanced research", "Market analysis", "Trading tools"]
    },
    regulations: {
      regulators: ["CFTC", "NFA", "FCA", "ASIC"],
      licenses: ["NFA ID: 0339826", "FRN 509909"],
      clientProtection: ["SIPC protection", "Segregated funds", "Regulatory compliance"]
    },
    riskControl: {
      level: "Low",
      measures: ["Institutional-grade risk management", "Real-time monitoring", "Compliance controls"],
      score: 8.9
    },
    trading: {
      platforms: ["FOREXTrader", "MetaTrader 4", "TradingView"],
      assets: 80,
      executionSpeed: "0.9ms",
      riskLevel: "Low"
    }
  },
  {
    id: "ig-group",
    name: "IG Group",
    logo: "https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 8.4,
      minSpread: "0.6 pips",
      maxLeverage: "1:30",
      minDeposit: 250,
      established: 1974,
      regulatedBy: ["FCA", "ASIC", "MAS"]
    },
    ratings: {
      overall: 8.4,
      spreads: 8.2,
      execution: 8.5,
      platform: 8.8,
      support: 8.1
    },
    promotions: {
      welcomeBonus: "No welcome bonus",
      depositBonus: "No deposit bonus",
      specialOffers: ["Advanced charting", "Market research", "Risk management tools"]
    },
    regulations: {
      regulators: ["FCA", "ASIC", "MAS", "BaFin", "CONSOB"],
      licenses: ["FRN 195355", "AFSL 515106", "CMS100648"],
      clientProtection: ["FSCS protection", "Segregated funds", "Professional indemnity"]
    },
    riskControl: {
      level: "Low",
      measures: ["Conservative approach", "Risk education", "Professional tools"],
      score: 8.6
    },
    trading: {
      platforms: ["IG Trading Platform", "MetaTrader 4", "ProRealTime"],
      assets: 17000,
      executionSpeed: "1.0ms",
      riskLevel: "Low"
    }
  },
  {
    id: "plus500",
    name: "Plus500",
    logo: "https://images.pexels.com/photos/8370733/pexels-photo-8370733.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 8.2,
      minSpread: "0.7 pips",
      maxLeverage: "1:30",
      minDeposit: 100,
      established: 2008,
      regulatedBy: ["FCA", "CySEC", "ASIC", "MAS"]
    },
    ratings: {
      overall: 8.2,
      spreads: 8.0,
      execution: 8.3,
      platform: 8.5,
      support: 7.9
    },
    promotions: {
      welcomeBonus: "Welcome bonus available",
      depositBonus: "Deposit bonus terms apply",
      specialOffers: ["Risk-free trades", "Mobile trading", "User-friendly platform"]
    },
    regulations: {
      regulators: ["FCA", "CySEC", "ASIC", "MAS", "FSCA"],
      licenses: ["FRN 509909", "CIF 250/14", "AFSL 417727"],
      clientProtection: ["FSCS protection", "Segregated funds", "Investor compensation"]
    },
    riskControl: {
      level: "Medium",
      measures: ["Risk warnings", "Educational materials", "Position monitoring"],
      score: 8.0
    },
    trading: {
      platforms: ["Plus500 WebTrader", "Plus500 Mobile"],
      assets: 2800,
      executionSpeed: "1.1ms",
      riskLevel: "Medium"
    }
  },
  {
    id: "etoro",
    name: "eToro",
    logo: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 8.0,
      minSpread: "1.0 pips",
      maxLeverage: "1:30",
      minDeposit: 50,
      established: 2007,
      regulatedBy: ["CySEC", "FCA", "ASIC"]
    },
    ratings: {
      overall: 8.0,
      spreads: 7.5,
      execution: 7.8,
      platform: 8.5,
      support: 8.2
    },
    promotions: {
      welcomeBonus: "Welcome package available",
      depositBonus: "Various promotional offers",
      specialOffers: ["Social trading", "Copy trading", "CopyPortfolios"]
    },
    regulations: {
      regulators: ["CySEC", "FCA", "ASIC", "FINRA"],
      licenses: ["CIF 109/10", "FRN 583263", "AFSL 491139"],
      clientProtection: ["Investor compensation", "Segregated funds", "Regulatory oversight"]
    },
    riskControl: {
      level: "Medium",
      measures: ["Social trading features", "Risk scores", "Educational content"],
      score: 7.8
    },
    trading: {
      platforms: ["eToro Platform", "eToro Mobile"],
      assets: 3000,
      executionSpeed: "1.3ms",
      riskLevel: "Medium"
    }
  },
  {
    id: "avatrade",
    name: "AvaTrade",
    logo: "https://images.pexels.com/photos/8370421/pexels-photo-8370421.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 7.8,
      minSpread: "0.9 pips",
      maxLeverage: "1:400",
      minDeposit: 100,
      established: 2006,
      regulatedBy: ["CBI", "ASIC", "FSA", "FSCA"]
    },
    ratings: {
      overall: 7.8,
      spreads: 7.6,
      execution: 7.9,
      platform: 8.0,
      support: 7.7
    },
    promotions: {
      welcomeBonus: "Welcome bonus up to $10,000",
      depositBonus: "Deposit bonus available",
      specialOffers: ["Trading Central", "Educational resources", "Copy trading"]
    },
    regulations: {
      regulators: ["CBI", "ASIC", "FSA", "FSCA", "ADGM"],
      licenses: ["C53877", "AFSL 406684", "SD076"],
      clientProtection: ["Segregated funds", "Investor compensation", "Regulatory compliance"]
    },
    riskControl: {
      level: "Medium",
      measures: ["Risk management tools", "Educational resources", "Trading alerts"],
      score: 7.9
    },
    trading: {
      platforms: ["MetaTrader 4", "MetaTrader 5", "AvaTradeGO"],
      assets: 1250,
      executionSpeed: "1.4ms",
      riskLevel: "Medium"
    }
  },
  {
    id: "exness",
    name: "Exness",
    logo: "https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 7.6,
      minSpread: "0.3 pips",
      maxLeverage: "1:2000",
      minDeposit: 1,
      established: 2008,
      regulatedBy: ["CySEC", "FCA", "FSA"]
    },
    ratings: {
      overall: 7.6,
      spreads: 8.2,
      execution: 7.8,
      platform: 7.4,
      support: 7.2
    },
    promotions: {
      welcomeBonus: "No welcome bonus",
      depositBonus: "No deposit bonus",
      specialOffers: ["Instant withdrawals", "High leverage", "Professional accounts"]
    },
    regulations: {
      regulators: ["CySEC", "FCA", "FSA", "FSCA"],
      licenses: ["CIF 178/12", "FRN 730729", "SD025"],
      clientProtection: ["Segregated funds", "Negative balance protection", "Investor compensation"]
    },
    riskControl: {
      level: "High",
      measures: ["High leverage warning", "Risk disclosure", "Professional trader requirements"],
      score: 6.8
    },
    trading: {
      platforms: ["MetaTrader 4", "MetaTrader 5", "Exness Terminal"],
      assets: 200,
      executionSpeed: "0.7ms",
      riskLevel: "High"
    }
  },
  {
    id: "admiral-markets",
    name: "Admiral Markets",
    logo: "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    overview: {
      rating: 7.4,
      minSpread: "0.5 pips",
      maxLeverage: "1:500",
      minDeposit: 100,
      established: 2001,
      regulatedBy: ["FCA", "CySEC", "ASIC"]
    },
    ratings: {
      overall: 7.4,
      spreads: 7.8,
      execution: 7.6,
      platform: 7.2,
      support: 7.0
    },
    promotions: {
      welcomeBonus: "No welcome bonus",
      depositBonus: "No deposit bonus",
      specialOffers: ["MetaTrader Supreme Edition", "Educational resources", "Market analysis"]
    },
    regulations: {
      regulators: ["FCA", "CySEC", "ASIC", "EFSA"],
      licenses: ["FRN 595450", "CIF 201/13", "AFSL 410681"],
      clientProtection: ["FSCS protection", "Segregated funds", "Professional indemnity"]
    },
    riskControl: {
      level: "Medium",
      measures: ["Risk management education", "Trading tools", "Market analysis"],
      score: 7.5
    },
    trading: {
      platforms: ["MetaTrader 4", "MetaTrader 5", "MetaTrader Supreme"],
      assets: 8000,
      executionSpeed: "1.2ms",
      riskLevel: "Medium"
    }
  }
];