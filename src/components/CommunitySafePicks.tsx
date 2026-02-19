import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ExternalLink, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface SafePick {
  id: string;
  product_name: string;
  product_url: string;
  trust_score: number;
  brand: string;
  created_at: string;
}

export function CommunitySafePicks({ onViewReport }: { onViewReport?: (id: string) => void }) {
  const [picks, setPicks] = useState<SafePick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPicks() {
      const { data, error } = await supabase
        .from('scans')
        .select('id, product_name, product_url, trust_score, brand, created_at')
        .gte('trust_score', 90)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (!error && data) {
        setPicks(data);
      }
      setLoading(false);
    }
    fetchPicks();
  }, []);

  if (loading || picks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-10"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-trusted/15 flex items-center justify-center">
          <Shield className="w-4 h-4 text-trusted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Community Safe Picks</h3>
        <span className="text-xs text-muted-foreground ml-auto">Score 90+</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
        {picks.map((pick, i) => (
          <motion.button
            key={pick.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => onViewReport?.(pick.id)}
            className="flex-shrink-0 w-56 bg-card border border-border/50 rounded-2xl p-4 text-left hover:border-trusted/40 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "px-2.5 py-1 rounded-full text-xs font-bold",
                "bg-trusted/10 text-trusted border border-trusted/20"
              )}>
                {pick.trust_score}%
              </div>
              <Star className="w-3.5 h-3.5 text-trusted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="font-medium text-sm text-foreground truncate mb-1">{pick.product_name}</p>
            {pick.brand && (
              <p className="text-xs text-muted-foreground truncate">{pick.brand}</p>
            )}
            <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-3 h-3" />
              View Report
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
