import { AnalysisResult, HistoryItem } from '@/types/analysis';

const HISTORY_KEY = 'truthcart_history';
const USAGE_KEY = 'truthcart_usage';
const MAX_HISTORY = 5;
const MAX_FREE_SCANS = 10;

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
  
  // Add to beginning, remove duplicates, limit to MAX_HISTORY
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

export function getScanCount(): number {
  try {
    const data = localStorage.getItem(USAGE_KEY);
    if (!data) return 0;
    
    const { count, date } = JSON.parse(data);
    const today = new Date().toDateString();
    
    // Reset count if it's a new day
    if (date !== today) {
      return 0;
    }
    
    return count;
  } catch {
    return 0;
  }
}

export function incrementScanCount(): number {
  const today = new Date().toDateString();
  const currentCount = getScanCount();
  const newCount = currentCount + 1;
  
  localStorage.setItem(USAGE_KEY, JSON.stringify({
    count: newCount,
    date: today,
  }));
  
  return newCount;
}

export function canPerformFreeScan(): boolean {
  return getScanCount() < MAX_FREE_SCANS;
}

export function getRemainingScans(): number {
  return Math.max(0, MAX_FREE_SCANS - getScanCount());
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
