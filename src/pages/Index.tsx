import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AnalysisForm } from '@/components/AnalysisForm';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { LoadingSteps } from '@/components/LoadingSteps';
import { HistoryList } from '@/components/HistoryList';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  getHistory,
  saveToHistory,
  getFullResult,
  saveFullResult,
  canPerformFreeScan,
  getRemainingScans,
  incrementScanCount,
} from '@/lib/storage';
import { AnalysisInput, AnalysisResult, HistoryItem } from '@/types/analysis';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [remainingScans, setRemainingScans] = useState(getRemainingScans());

  const { isAuthenticated, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Mock premium status (in production, check against actual subscription)
  const hasPremium = false;

  useEffect(() => {
    setHistory(getHistory());
    setRemainingScans(getRemainingScans());
  }, []);

  const handleAnalysis = async (input: AnalysisInput) => {
    // Check limits for free users
    if (!isAuthenticated && input.mode === 'fast' && !canPerformFreeScan()) {
      toast({
        title: 'Scan limit reached',
        description: 'Sign in to continue using TruthCart.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: input,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const analysisResult = data as AnalysisResult;

      // Save result
      saveFullResult(analysisResult);
      saveToHistory(analysisResult);
      setHistory(getHistory());

      // Increment usage for free users
      if (!isAuthenticated) {
        incrementScanCount();
        setRemainingScans(getRemainingScans());
      }

      setResult(analysisResult);

      toast({
        title: 'Analysis complete',
        description: `Trust score: ${analysisResult.trustScore}/100`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (id: string) => {
    const savedResult = getFullResult(id);
    if (savedResult) {
      setResult(savedResult);
    } else {
      toast({
        title: 'Result not found',
        description: 'This analysis result is no longer available.',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Show loading state */}
        {isLoading && (
          <div className="max-w-xl mx-auto">
            <LoadingSteps isLoading={isLoading} />
          </div>
        )}

        {/* Show results */}
        {!isLoading && result && (
          <ResultsDashboard result={result} onBack={handleBack} />
        )}

        {/* Show input form */}
        {!isLoading && !result && (
          <div className="max-w-4xl mx-auto">
            {/* Main Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <AnalysisForm
                  onSubmit={handleAnalysis}
                  isLoading={isLoading}
                  remainingScans={remainingScans}
                  canPerformFree={canPerformFreeScan()}
                  isAuthenticated={isAuthenticated}
                  hasPremium={hasPremium}
                />
              </div>

              {/* History Section */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 card-shadow h-full">
                  <HistoryList items={history} onSelect={handleHistorySelect} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 TruthCart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}