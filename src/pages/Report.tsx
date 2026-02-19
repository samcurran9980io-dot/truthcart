import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { useAuth } from '@/hooks/useAuth';
import { getUserPlan } from '@/lib/storage';
import { ArrowLeft } from 'lucide-react';
import { AnalysisResult } from '@/types/analysis';

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const userPlan = getUserPlan();

  useEffect(() => {
    async function fetchReport() {
      if (!id) { setNotFound(true); setLoading(false); return; }

      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
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
      }
      setLoading(false);
    }
    fetchReport();
  }, [id]);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingOrbs />
      <Header isAuthenticated={isAuthenticated} onLogout={signOut} userPlan={userPlan} />

      <main className="container mx-auto px-4 py-10 md:py-16 relative z-10">
        {loading && (
          <div className="flex items-center justify-center min-h-[40vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
            />
          </div>
        )}

        {notFound && (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">Report Not Found</h1>
            <p className="text-muted-foreground mb-6">This report may have been deleted or doesn't exist.</p>
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to TruthCart
            </Link>
          </div>
        )}

        {result && (
          <ResultsDashboard result={result} onBack={() => window.history.back()} />
        )}
      </main>
    </div>
  );
}
