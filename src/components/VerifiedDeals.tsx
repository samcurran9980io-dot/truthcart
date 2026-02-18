import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface VerifiedDeal {
  id: string;
  product_name: string;
  product_image: string;
  price: number;
  trust_score: number;
  deal_url: string;
  platform: string;
}

export function VerifiedDeals() {
  const [deals, setDeals] = useState<VerifiedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from('verified_deals')
          .select('*')
          .order('trust_score', { ascending: false })
          .limit(6);

        if (error) throw error;
        setDeals(data || []);
      } catch (err) {
        console.error('Failed to fetch deals:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-40 h-6 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-72 h-80 bg-muted rounded-3xl animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (deals.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="py-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-trusted" />
            Today's Verified Safe Picks
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Community-verified products with the highest trust scores
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="w-72 shrink-0 snap-start"
          >
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-premium hover:shadow-premium-xl transition-all duration-300 group hover:-translate-y-1">
              {/* Image */}
              <div className="relative h-44 bg-secondary/30 overflow-hidden">
                <img
                  src={deal.product_image}
                  alt={deal.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <Badge className="absolute top-3 right-3 bg-trusted text-primary-foreground border-none shadow-lg">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {deal.trust_score}% Safe
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs text-muted-foreground mb-1">{deal.platform}</p>
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
                  {deal.product_name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    ${deal.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    className="rounded-xl gap-1.5 bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <a
                      href={deal.deal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Deal
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
