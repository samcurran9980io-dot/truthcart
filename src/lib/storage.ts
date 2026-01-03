import { AnalysisResult, HistoryItem } from '@/types/analysis';
import { type UserPlan, type PlanId, CREDIT_COSTS, getPlanById } from '@/lib/plans';

const HISTORY_KEY = 'truthcart_history';
const USER_PLAN_KEY = 'truthcart_user_plan';
const MAX_HISTORY = 5;

// Get default plan for new users
function getDefaultPlan(): UserPlan {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  return {
    planId: 'free',
    billingCycle: 'monthly',
    creditsUsed: 0,
    creditsTotal: 10,
    renewsAt: nextMonth.toISOString(),
  };
}

export function getUserPlan(): UserPlan {
  try {
    const data = localStorage.getItem(USER_PLAN_KEY);
    if (!data) return getDefaultPlan();
    
    const plan = JSON.parse(data) as UserPlan;
    
    // Check if credits need to reset (for paid plans)
    if (plan.planId !== 'free' && new Date(plan.renewsAt) < new Date()) {
      const planDef = getPlanById(plan.planId);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      return {
        ...plan,
        creditsUsed: 0,
        creditsTotal: planDef?.credits ?? plan.creditsTotal,
        renewsAt: nextMonth.toISOString(),
      };
    }
    
    return plan;
  } catch {
    return getDefaultPlan();
  }
}

export function saveUserPlan(plan: UserPlan): void {
  localStorage.setItem(USER_PLAN_KEY, JSON.stringify(plan));
}

export function upgradePlan(planId: PlanId, billingCycle: 'monthly' | 'yearly'): UserPlan {
  const planDef = getPlanById(planId);
  if (!planDef) throw new Error('Invalid plan');
  
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + (billingCycle === 'yearly' ? 12 : 1));
  
  const newPlan: UserPlan = {
    planId,
    billingCycle,
    creditsUsed: 0,
    creditsTotal: planDef.credits,
    renewsAt: nextMonth.toISOString(),
  };
  
  saveUserPlan(newPlan);
  return newPlan;
}

export function useCredits(mode: 'fast' | 'deep'): boolean {
  const plan = getUserPlan();
  const cost = mode === 'fast' ? CREDIT_COSTS.quickScan : CREDIT_COSTS.deepResearch;
  const remaining = plan.creditsTotal - plan.creditsUsed;
  
  if (remaining < cost) return false;
  
  const updatedPlan = {
    ...plan,
    creditsUsed: plan.creditsUsed + cost,
  };
  
  saveUserPlan(updatedPlan);
  return true;
}

export function canPerformScan(mode: 'fast' | 'deep'): boolean {
  const plan = getUserPlan();
  const cost = mode === 'fast' ? CREDIT_COSTS.quickScan : CREDIT_COSTS.deepResearch;
  const remaining = plan.creditsTotal - plan.creditsUsed;
  return remaining >= cost;
}

export function getCreditsRemaining(): number {
  const plan = getUserPlan();
  return Math.max(0, plan.creditsTotal - plan.creditsUsed);
}

// History functions
export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(result: AnalysisResult): void {
  const history = getHistory();
  
  const historyItem: HistoryItem = {
    id: result.id,
    productName: result.productName,
    trustScore: result.trustScore,
    status: result.status,
    mode: result.mode,
    analyzedAt: result.analyzedAt,
  };
  
  const filtered = history.filter(item => item.id !== result.id);
  const updated = [historyItem, ...filtered].slice(0, MAX_HISTORY);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getFullResult(id: string): AnalysisResult | null {
  try {
    const data = localStorage.getItem(`truthcart_result_${id}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveFullResult(result: AnalysisResult): void {
  localStorage.setItem(`truthcart_result_${result.id}`, JSON.stringify(result));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// Legacy compatibility
export function getRemainingScans(): number {
  return getCreditsRemaining();
}

export function canPerformFreeScan(): boolean {
  return canPerformScan('fast');
}

export function incrementScanCount(): void {
  useCredits('fast');
}
