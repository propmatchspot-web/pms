export interface Challenge {
  id: string;
  firmId: string;
  name: string;
  accountSize: string;
  price: string;
  profitTarget: string;
  dailyDrawdown: string;
  maxDrawdown: string;
  minTradingDays: string;
  maxLeverage: string;
  challengeType: '1-Step' | '2-Step' | '3-Step' | 'Instant';
}

export interface PropFirm {
  id: string;
  name: string;
  website?: string;
  affiliateLink?: string;
  logo: string;
  rating: number;
  reviewCount: number;
  trustScore: number;
  maxFunding: number;
  profitSplit: string;
  drawdown: string;
  price?: number; // Lowest price displayed
  minDays?: number;
  phaseCount?: number;
  tags: string[];
  description: string;
  founded?: number; // UI uses number, DB uses string (founded_year) - mapper will handle
  foundedYear?: string; // DB field
  hqLocation?: string;
  platforms: string[];
  paymentMethods?: string[];
  challenges?: Challenge[];
  status?: 'active' | 'draft' | 'inactive';
}

export interface Review {
  id: string;
  firmId: string;
  user: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

export interface Offer {
  id: string;
  firmId: string;
  firmName: string;
  logo: string;
  discount: string;
  code: string;
  expiry: string;
  description: string;
}

export type SortOption = 'rating' | 'price_low' | 'price_high' | 'funding_high';