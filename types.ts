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
  websiteUrl?: string;
  affiliateLink?: string;
  discountCode?: string;
  logo: string;
  favicon?: string | null;
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
  // Trading Specs
  leverage?: string;
  newsTrading?: boolean;
  weekendHolding?: boolean;
  scalingPlan?: boolean;
  scalingPlanDetails?: string;
  // Payout Stats
  avgPayoutTime?: string;
  payoutPercentage?: number;
  last30DaysPayouts?: string;
  payoutGrowth?: string;
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