import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AnalysisForm, AnalysisFormRef } from '@/components/AnalysisForm';
import { ChromeExtensionBanner } from '@/components/ChromeExtensionBanner';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { StatsCounter } from '@/components/StatsCounter';
import { PlatformLogos } from '@/components/PlatformLogos';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { LoadingSteps } from '@/components/LoadingSteps';
import { HistoryList } from '@/components/HistoryList';
import { CreditDisplay } from '@/components/CreditDisplay';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { triggerSuccessConfetti } from '@/lib/confetti';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef<AnalysisFormRef>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan>(getUserPlan());
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<'no-credits' | 'deep-research-locked' | 'limit-reached' | null>(null);
  
  // Auto-analysis from URL params (extension support)
  const [initialProductUrl, setInitialProductUrl] = useState('');
  const [initialProductName, setInitialProductName] = useState('');
  const [autoAnalysisTriggered, setAutoAnalysisTriggered] = useState(false);

  const { isAuthenticated, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Parse URL params and set initial values
  useEffect(() => {
    const urlParam = searchParams.get('url');
    const nameParam = searchParams.get('name');
    const autoParam = searchParams.get('auto');
    
    if (urlParam) {
      setInitialProductUrl(decodeURIComponent(urlParam));
    }
    if (nameParam) {
      setInitialProductName(decodeURIComponent(nameParam));
    }
    
    // Auto-trigger analysis if auto=true and we have required fields
    if (autoParam === 'true' && urlParam && nameParam && !autoAnalysisTriggered) {
      setAutoAnalysisTriggered(true);
      // Wait for form to populate, then trigger submit
      setTimeout(() => {
        formRef.current?.triggerSubmit();
      }, 500);
    }
    
    // Clear URL params after reading them
    if (urlParam || nameParam || autoParam) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, autoAnalysisTriggered]);

  useEffect(() => {
    setHistory(getHistory());
    setUserPlan(getUserPlan());
  }, []);

  const refreshPlan = () => {
    setUserPlan(getUserPlan());
  };

  const handleAnalysis = async (input: AnalysisInput) => {
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

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const analysisResult = data as AnalysisResult;

      const success = useCredits(input.mode);
      if (!success) throw new Error('Failed to deduct credits');

      saveFullResult(analysisResult);
      saveToHistory(analysisResult);
      setHistory(getHistory());
      refreshPlan();

      setResult(analysisResult);

      // Trigger confetti on success!
      triggerSuccessConfetti();

      const creditsUsed = input.mode === 'fast' ? CREDIT_COSTS.quickScan : CREDIT_COSTS.deepResearch;
      toast({
        title: 'Analysis complete',
        description: `Trust score: ${analysisResult.trustScore}/100`,
      });

      const updatedPlan = getUserPlan();
      if (shouldShowWarning(updatedPlan)) {
        toast({
          title: 'Credits running low',
          description: `${updatedPlan.creditsTotal - updatedPlan.creditsUsed} credits remaining.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Please try again.',
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
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const remainingCredits = userPlan.creditsTotal - userPlan.creditsUsed;
  const hasPremium = userPlan.planId !== 'free';

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating Background Orbs */}
      <FloatingOrbs />
      
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        userPlan={userPlan}
      />

      <main className="container mx-auto px-4 py-10 md:py-16 relative z-10">
        {/* Loading State */}
        {isLoading && <LoadingSteps isLoading={isLoading} />}

        {/* Results */}
        {!isLoading && result && (
          <ResultsDashboard result={result} onBack={handleBack} />
        )}

        {/* Input Form */}
        {!isLoading && !result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto"
          >
            {/* Stats Counter */}
            <StatsCounter />

            {/* Upgrade Prompt */}
            {showUpgradePrompt && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <UpgradePrompt 
                  reason={showUpgradePrompt} 
                  currentPlan={userPlan.planId} 
                />
              </motion.div>
            )}

            {/* Chrome Extension Banner */}
            <ChromeExtensionBanner />

            {/* Main Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <AnalysisForm
                  ref={formRef}
                  onSubmit={handleAnalysis}
                  isLoading={isLoading}
                  remainingScans={remainingCredits}
                  canPerformFree={canPerformScan('fast')}
                  isAuthenticated={isAuthenticated}
                  hasPremium={hasPremium}
                  onUpgradeClick={() => setShowUpgradePrompt('deep-research-locked')}
                  initialProductName={initialProductName}
                  initialProductUrl={initialProductUrl}
                />
                
                {/* Platform Logos */}
                <PlatformLogos />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Credits */}
                <CreditDisplay userPlan={userPlan} variant="full" />

                {/* History */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-3xl p-6 shadow-premium border border-border/50"
                >
                  <HistoryList items={history} onSelect={handleHistorySelect} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer with gradient divider */}
      <footer className="mt-auto relative">
        {/* Gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
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
