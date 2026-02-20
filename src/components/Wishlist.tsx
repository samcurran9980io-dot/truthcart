import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ExternalLink, Trash2, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface WishlistItem {
  id: string;
  scan_id: string;
  product_name: string;
  product_url: string;
  trust_score: number;
  status: string;
  created_at: string;
}

interface WishlistProps {
  isAuthenticated: boolean;
  userId?: string;
}

const statusColors: Record<string, string> = {
  trusted: 'text-trusted',
  mixed: 'text-mixed',
  suspicious: 'text-suspicious',
};

const statusBg: Record<string, string> = {
  trusted: 'bg-trusted/10 border-trusted/20',
  mixed: 'bg-mixed/10 border-mixed/20',
  suspicious: 'bg-suspicious/10 border-suspicious/20',
};

export function Wishlist({ isAuthenticated, userId }: WishlistProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && userId) fetchWishlist();
    else setItems([]);
  }, [isAuthenticated, userId]);

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRemovingId(id);
    const { error } = await supabase.from('wishlists').delete().eq('id', id);
    if (error) {
      toast.error('Failed to remove from wishlist');
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Removed from wishlist');
    }
    setRemovingId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-premium">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">Wishlist</h3>
        </div>
        <div className="text-center py-6 text-muted-foreground">
          <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Sign in to save products to your wishlist</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-3xl p-6 border border-border/50 shadow-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">Wishlist</h3>
          {items.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {items.length}
            </span>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No saved products yet</p>
          <p className="text-xs mt-1 opacity-70">Heart a product from your scan results to save it here</p>
        </div>
      )}

      <AnimatePresence>
        <div className="space-y-2">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group relative"
            >
              <div className={cn(
                'p-3 rounded-xl border transition-all duration-200',
                statusBg[item.status] || 'bg-secondary/50 border-border'
              )}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.product_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('text-xs font-bold', statusColors[item.status] || 'text-muted-foreground')}>
                        {item.trust_score}/100
                      </span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-muted-foreground text-xs capitalize">{item.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      to={`/report/${item.scan_id}`}
                      className="p-1.5 rounded-lg hover:bg-background/50 text-muted-foreground hover:text-primary transition-colors"
                      title="View report"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={item.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-background/50 text-muted-foreground hover:text-primary transition-colors"
                      title="View product"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={(e) => handleRemove(e, item.id)}
                      disabled={removingId === item.id}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

// Hook to manage wishlist state for use in ResultsDashboard
export function useWishlist(userId?: string) {
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const [toggling, setToggling] = useState(false);

  const checkWishlisted = async (scanId: string) => {
    if (!userId) return;
    const { data } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('scan_id', scanId)
      .single();
    if (data) setWishlisted((prev) => new Set([...prev, scanId]));
  };

  const toggle = async (
    scanId: string,
    productName: string,
    productUrl: string,
    trustScore: number,
    status: string
  ) => {
    if (!userId) {
      toast.error('Sign in to save products to your wishlist');
      return;
    }
    setToggling(true);
    const isAdded = wishlisted.has(scanId);

    if (isAdded) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('scan_id', scanId);
      if (error) {
        toast.error('Failed to remove from wishlist');
      } else {
        setWishlisted((prev) => {
          const next = new Set(prev);
          next.delete(scanId);
          return next;
        });
        toast.success('Removed from wishlist');
      }
    } else {
      const { error } = await supabase.from('wishlists').insert({
        user_id: userId,
        scan_id: scanId,
        product_name: productName,
        product_url: productUrl,
        trust_score: trustScore,
        status,
      });
      if (error) {
        toast.error('Failed to add to wishlist');
      } else {
        setWishlisted((prev) => new Set([...prev, scanId]));
        toast.success('Added to wishlist! ❤️');
      }
    }
    setToggling(false);
  };

  return { wishlisted, checkWishlisted, toggle, toggling };
}
