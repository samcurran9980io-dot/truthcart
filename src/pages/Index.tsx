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
import { ShieldCheck, History, Sparkles } from 'lucide-react';

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
          <div className="max-w-4xl mx-auto">
            <ResultsDashboard result={result} onBack={handleBack} />
          </div>
        )}

        {/* Show input form */}
        {!isLoading && !result && (
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Trust Analysis
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Know Before You Buy
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Analyze real community sentiment to discover the truth about any product. 
                Cut through promotional noise and make confident decisions.
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="md:col-span-2">
                <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow-lg animate-fade-in-up animation-delay-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold">Analyze a Product</h2>
                      <p className="text-sm text-muted-foreground">Enter product details below</p>
                    </div>
                  </div>

                  <AnalysisForm
                    onSubmit={handleAnalysis}
                    isLoading={isLoading}
                    remainingScans={remainingScans}
                    canPerformFree={canPerformFreeScan()}
                    isAuthenticated={isAuthenticated}
                    hasPremium={hasPremium}
                  />
                </div>
              </div>

              {/* History Section */}
              <div className="animate-fade-in-up animation-delay-200">
                <div className="bg-card rounded-2xl p-6 card-shadow h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <History className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold">Recent Scans</h3>
                      <p className="text-xs text-muted-foreground">Last 5 analyses</p>
                    </div>
                  </div>

                  <HistoryList items={history} onSelect={handleHistorySelect} />
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6 mt-12 animate-fade-in-up animation-delay-300">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-2xl bg-trusted/10 text-trusted flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold mb-2">Community Signals</h3>
                <p className="text-sm text-muted-foreground">Real feedback from forums, reviews, and discussions</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-2xl bg-mixed/10 text-mixed flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold mb-2">Reality Gap Detection</h3>
                <p className="text-sm text-muted-foreground">Compare marketing claims to actual experiences</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold mb-2">Trust Score</h3>
                <p className="text-sm text-muted-foreground">Clear 0-100 rating with detailed breakdown</p>
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
