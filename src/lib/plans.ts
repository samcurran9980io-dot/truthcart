// TruthCart Pricing & Credit System

export type PlanId = 'free' | 'basic' | 'pro';
export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyMonthlyEquivalent: number;
  yearlySavings: number;
  credits: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface UserPlan {
  planId: PlanId;
  billingCycle: BillingCycle;
  creditsUsed: number;
  creditsTotal: number;
  renewsAt: string;
}

// Credit costs
export const CREDIT_COSTS = {
  quickScan: 1,
  deepResearch: 3,
} as const;

// Plan definitions
export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying TruthCart',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyMonthlyEquivalent: 0,
    yearlySavings: 0,
    credits: 5, // 5 credits daily (resets at midnight UTC)
    features: [
      '5 credits/day (resets at midnight UTC)',
      'No login required',
      'Basic trust scores',
      'Limited history',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For everyday shoppers',
    monthlyPrice: 2.99,
    yearlyPrice: 24.99,
    yearlyMonthlyEquivalent: 2.08,
    yearlySavings: 11,
    credits: 200,
    features: [
      '200 credits/month',
      'Up to 200 Quick Scans',
      'Up to 66 Deep Research',
      'Full analysis dashboard',
      'Complete history',
      'Export PDF reports',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power shoppers',
    monthlyPrice: 6.99,
    yearlyPrice: 59.99,
    yearlyMonthlyEquivalent: 5.00,
    yearlySavings: 24,
    credits: 600,
    highlighted: true,
    badge: 'Most Popular',
    features: [
      '600 credits/month',
      'Up to 600 Quick Scans',
      'Up to 200 Deep Research',
      'Priority AI processing',
      'Full community analysis',
      'Export PDF reports',
      'Chrome extension pro features',
      'Data source links',
      'Priority support',
    ],
  },
];

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find(plan => plan.id === id);
}

export function calculateMaxScans(credits: number): { quickScans: number; deepResearch: number } {
  return {
    quickScans: Math.floor(credits / CREDIT_COSTS.quickScan),
    deepResearch: Math.floor(credits / CREDIT_COSTS.deepResearch),
  };
}

export function formatPrice(price: number): string {
  return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
}

export function getCreditsRemaining(plan: UserPlan): number {
  return Math.max(0, plan.creditsTotal - plan.creditsUsed);
}

export function getCreditsPercentage(plan: UserPlan): number {
  if (plan.creditsTotal === 0) return 0;
  return Math.round((plan.creditsUsed / plan.creditsTotal) * 100);
}

export function shouldShowWarning(plan: UserPlan): boolean {
  return getCreditsPercentage(plan) >= 80;
}

export function canPerformScan(plan: UserPlan, mode: 'fast' | 'deep'): boolean {
  const cost = mode === 'fast' ? CREDIT_COSTS.quickScan : CREDIT_COSTS.deepResearch;
  return getCreditsRemaining(plan) >= cost;
}
