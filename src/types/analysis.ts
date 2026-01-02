export type AnalysisMode = 'fast' | 'deep';

export type TrustStatus = 'trusted' | 'mixed' | 'suspicious';

export interface AnalysisInput {
  productName: string;
  brand?: string;
  productUrl: string;
  mode: AnalysisMode;
}

export interface BreakdownItem {
  label: string;
  score: number;
  description: string;
}

export interface CommunitySignal {
  source: string;
  sourceUrl?: string;
  quote: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface DataSource {
  url: string;
  platform: string;
}

export interface AnalysisResult {
  id: string;
  productName: string;
  brand?: string;
  productUrl: string;
  mode: AnalysisMode;
  trustScore: number;
  status: TrustStatus;
  verdict: string;
  breakdown: BreakdownItem[];
  communitySignals?: CommunitySignal[];
  riskFactors?: string[];
  dataSources?: DataSource[];
  confidence?: 'low' | 'medium' | 'high';
  analyzedAt: string;
}

export interface HistoryItem {
  id: string;
  productName: string;
  trustScore: number;
  status: TrustStatus;
  mode: AnalysisMode;
  analyzedAt: string;
}