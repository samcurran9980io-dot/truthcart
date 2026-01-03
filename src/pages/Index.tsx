import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AnalysisForm } from '@/components/AnalysisForm';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { LoadingSteps } from '@/components/LoadingSteps';
import { HistoryList } from '@/components/HistoryList';
import { CreditDisplay } from '@/components/CreditDisplay';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  getHistory,
  saveToHistory,
  getFullResult,
  saveFullResult,
  getUserPlan,
  useCredits,
  canPerformScan,
} from '@/lib/storage';
import { type UserPlan, shouldShowWarning, CREDIT_COSTS } from '@/lib/plans';
import { AnalysisInput, AnalysisResult, HistoryItem } from '@/types/analysis';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan>(getUserPlan());
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<'no-credits' | 'deep-research-locked' | 'limit-reached' | null>(null);

  const { isAuthenticated, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setHistory(getHistory());
    setUserPlan(getUserPlan());
  }, []);

  const refreshPlan = () => {
    setUserPlan(getUserPlan());
  };

  const handleAnalysis = async (input: AnalysisInput) => {
    // Check if user can perform the scan
    if (!canPerformScan(input.mode)) {
      if (userPlan.planId === 'free' && userPlan.creditsUsed >= userPlan.creditsTotal) {
        setShowUpgradePrompt('limit-reached');
      } else if (input.mode === 'deep' && userPlan.planId === 'free') {
        setShowUpgradePrompt('deep-research-locked');
      } else {
        setShowUpgradePrompt('no-credits');
      }
      return;
    }

    // Deep research requires paid plan
    if (input.mode === 'deep' && userPlan.planId === 'free') {
      setShowUpgradePrompt('deep-research-locked');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setShowUpgradePrompt(null);

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

      // Use credits
      const success = useCredits(input.mode);
      if (!success) {
        throw new Error('Failed to deduct credits');
      }

      // Save result
      saveFullResult(analysisResult);
      saveToHistory(analysisResult);
      setHistory(getHistory());
      refreshPlan();

      setResult(analysisResult);

      const creditsUsed = input.mode === 'fast' ? CREDIT_COSTS.quickScan : CREDIT_COSTS.deepResearch;
      toast({
        title: 'Analysis complete',
        description: `Trust score: ${analysisResult.trustScore}/100 (${creditsUsed} credit${creditsUsed > 1 ? 's' : ''} used)`,
      });

      // Show warning if low on credits
      const updatedPlan = getUserPlan();
      if (shouldShowWarning(updatedPlan)) {
        toast({
          title: 'Credits running low',
          description: `You have ${updatedPlan.creditsTotal - updatedPlan.creditsUsed} credits remaining.`,
          variant: 'destructive',
        });
      }
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
    setShowUpgradePrompt(null);
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

  const remainingCredits = userPlan.creditsTotal - userPlan.creditsUsed;
  const hasPremium = userPlan.planId !== 'free';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        userPlan={userPlan}
      />

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
          <div className="max-w-5xl mx-auto">
            {/* Upgrade Prompt */}
            {showUpgradePrompt && (
              <div className="mb-6">
                <UpgradePrompt 
                  reason={showUpgradePrompt} 
                  currentPlan={userPlan.planId} 
                />
              </div>
            )}

            {/* Main Layout */}
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <AnalysisForm
                  onSubmit={handleAnalysis}
                  isLoading={isLoading}
                  remainingScans={remainingCredits}
                  canPerformFree={canPerformScan('fast')}
                  isAuthenticated={isAuthenticated}
                  hasPremium={hasPremium}
                  onUpgradeClick={() => setShowUpgradePrompt('deep-research-locked')}
                />
              </div>

              {/* Credits Section */}
              <div className="lg:col-span-1">
                <CreditDisplay userPlan={userPlan} variant="full" />
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