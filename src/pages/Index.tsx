import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { SocialProofTicker } from '@/components/SocialProofTicker';
import { AnalysisForm, AnalysisFormRef } from '@/components/AnalysisForm';
import { ChromeExtensionBanner } from '@/components/ChromeExtensionBanner';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { StatsCounter, incrementProductsAnalyzed } from '@/components/StatsCounter';
import { PlatformLogos } from '@/components/PlatformLogos';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { LoadingSteps } from '@/components/LoadingSteps';
import { VaultList } from '@/components/VaultList';
import { CommunitySafePicks } from '@/components/CommunitySafePicks';
import { Wishlist } from '@/components/Wishlist';
import { CreditDisplay } from '@/components/CreditDisplay';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { CompareView } from '@/components/CompareView';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { triggerSuccessConfetti } from '@/lib/confetti';
import {
  getUserPlan,
  useCredits,
  canPerformScan,
  saveToHistory,
  saveFullResult,
  getFullResult,
} from '@/lib/storage';
import { type UserPlan, shouldShowWarning, CREDIT_COSTS } from '@/lib/plans';
import { AnalysisInput, AnalysisResult } from '@/types/analysis';

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef<AnalysisFormRef>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [compareItems, setCompareItems] = useState<AnalysisResult[]>([]);
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan>(getUserPlan());
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<'no-credits' | 'deep-research-locked' | 'limit-reached' | null>(null);
  
  const [initialProductUrl, setInitialProductUrl] = useState('');
  const [initialProductName, setInitialProductName] = useState('');
  const [autoAnalysisTriggered, setAutoAnalysisTriggered] = useState(false);

  const { isAuthenticated, user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { sendNotification } = useNotifications();

  // Parse URL params
  useEffect(() => {
    const urlParam = searchParams.get('url');
    const nameParam = searchParams.get('name');
    const autoParam = searchParams.get('auto');
    
    if (urlParam) setInitialProductUrl(decodeURIComponent(urlParam));
    if (nameParam) setInitialProductName(decodeURIComponent(nameParam));
    
    if (autoParam === 'true' && urlParam && nameParam && !autoAnalysisTriggered) {
      setAutoAnalysisTriggered(true);
      setTimeout(() => { formRef.current?.triggerSubmit(); }, 500);
    }
    
    if (urlParam || nameParam || autoParam) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, autoAnalysisTriggered]);

  // Fetch vault items
  const fetchVault = useCallback(async () => {
    if (!user) {
      setVaultItems([]);
      return;
    }
    const { data } = await supabase
      .from('scans')
      .select('id, product_name, trust_score, status, mode, pinned, created_at')
      .eq('user_id', user.id)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) setVaultItems(data);
  }, [user]);

  useEffect(() => {
    setUserPlan(getUserPlan());
    fetchVault();
  }, [fetchVault]);

  const refreshPlan = () => setUserPlan(getUserPlan());

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

      // Save locally (backward compat)
      saveFullResult(analysisResult);
      saveToHistory(analysisResult);
      refreshPlan();

      // Save to Supabase scans table
      await supabase.from('scans').insert({
        id: analysisResult.id,
        user_id: user?.id || null,
        product_name: analysisResult.productName,
        product_url: analysisResult.productUrl,
        brand: analysisResult.brand || '',
        trust_score: analysisResult.trustScore,
        status: analysisResult.status,
        mode: analysisResult.mode,
        verdict: analysisResult.verdict,
        breakdown: analysisResult.breakdown as any,
        community_signals: analysisResult.communitySignals as any,
        risk_factors: analysisResult.riskFactors as any,
        data_sources: analysisResult.dataSources as any,
        confidence: analysisResult.confidence || 'medium',
        is_public: true,
      });

      setResult(analysisResult);
      fetchVault();

      triggerSuccessConfetti();
      incrementProductsAnalyzed();

      // Send suspicious product alert email if score < 40 and user is authenticated
      if (analysisResult.trustScore < 40 && user?.email) {
        supabase.functions.invoke('send-suspicious-alert', {
          body: {
            userEmail: user.email,
            productName: analysisResult.productName,
            productUrl: analysisResult.productUrl,
            trustScore: analysisResult.trustScore,
            status: analysisResult.status,
            verdict: analysisResult.verdict,
            reportId: analysisResult.id,
          },
        }).catch((err) => console.warn('Alert email failed:', err));

        // Browser push notification for suspicious products
        sendNotification('⚠️ Suspicious Product Detected', {
          body: `${analysisResult.productName} scored ${analysisResult.trustScore}/100. Tap to view report.`,
          tag: `scan-${analysisResult.id}`,
        });
      }

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

  const handleVaultSelect = async (id: string) => {
    // Try Supabase first, then local
    const { data } = await supabase.from('scans').select('*').eq('id', id).single();
    if (data) {
      const mapped: AnalysisResult = {
        id: data.id,
        productName: data.product_name,
        brand: data.brand || undefined,
        productUrl: data.product_url,
        mode: data.mode as 'fast' | 'deep',
        trustScore: data.trust_score,
        status: data.status as 'trusted' | 'mixed' | 'suspicious',
        verdict: data.verdict || '',
        breakdown: (data.breakdown as any[]) || [],
        communitySignals: (data.community_signals as any[]) || [],
        riskFactors: (data.risk_factors as any[]) || [],
        dataSources: (data.data_sources as any[]) || [],
        confidence: (data.confidence as 'low' | 'medium' | 'high') || 'medium',
        analyzedAt: data.created_at,
      };
      setResult(mapped);
    } else {
      const local = getFullResult(id);
      if (local) setResult(local);
      else toast({ title: 'Result not found', variant: 'destructive' });
    }
  };

  const handleCommunityView = (id: string) => {
    navigate(`/report/${id}`);
  };

  const handleBack = () => {
    setResult(null);
    setCompareItems([]);
    setShowUpgradePrompt(null);
  };

  const handleCompare = async (ids: string[]) => {
    const results: AnalysisResult[] = [];
    for (const id of ids) {
      const { data } = await supabase.from('scans').select('*').eq('id', id).single();
      if (data) {
        results.push({
          id: data.id,
          productName: data.product_name,
          brand: data.brand || undefined,
          productUrl: data.product_url,
          mode: data.mode as 'fast' | 'deep',
          trustScore: data.trust_score,
          status: data.status as 'trusted' | 'mixed' | 'suspicious',
          verdict: data.verdict || '',
          breakdown: (data.breakdown as any[]) || [],
          communitySignals: (data.community_signals as any[]) || [],
          riskFactors: (data.risk_factors as any[]) || [],
          dataSources: (data.data_sources as any[]) || [],
          confidence: (data.confidence as 'low' | 'medium' | 'high') || 'medium',
          analyzedAt: data.created_at,
        });
      }
    }
    if (results.length >= 2) {
      setCompareItems(results);
      setResult(null);
    } else {
      toast({ title: 'Could not load products for comparison', variant: 'destructive' });
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully.' });
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
      <FloatingOrbs />
      
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        userPlan={userPlan}
      />
      <SocialProofTicker />

      <main className="container mx-auto px-4 py-10 md:py-16 relative z-10">
        {isLoading && <LoadingSteps isLoading={isLoading} />}

        {!isLoading && compareItems.length >= 2 && (
          <CompareView items={compareItems} onBack={handleBack} />
        )}

        

        {!isLoading && result && compareItems.length === 0 && (
          <ResultsDashboard result={result} onBack={handleBack} />
        )}

        {!isLoading && !result && compareItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto"
          >
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

            <div className="grid lg:grid-cols-3 gap-8">
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
                
                <PlatformLogos />

                {/* Community Safe Picks */}
                <CommunitySafePicks onViewReport={handleCommunityView} />
              </div>

              <div className="lg:col-span-1 space-y-5">
                <CreditDisplay userPlan={userPlan} variant="full" />

                {/* Chrome Extension - prominent placement */}
                <ChromeExtensionBanner />

                {/* TruthCart Vault */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-3xl p-6 shadow-premium border border-border/50"
                >
                  <VaultList
                    items={vaultItems}
                    onSelect={handleVaultSelect}
                    onRefresh={fetchVault}
                    isAuthenticated={isAuthenticated}
                    onCompare={handleCompare}
                  />
                </motion.div>

                {/* Wishlist */}
                <Wishlist isAuthenticated={isAuthenticated} userId={user?.id} />

                <StatsCounter variant="sidebar" />
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-auto relative">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 TruthCart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
