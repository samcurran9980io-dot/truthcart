import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Bell, BellOff, DollarSign, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PriceTrackerProps {
  wishlistId: string;
  productName: string;
  lastKnownPrice?: number | null;
  targetPrice?: number | null;
  alertEnabled?: boolean;
  userId: string;
  productUrl: string;
}

interface PricePoint {
  price: number;
  recorded_at: string;
}

export function PriceTracker({
  wishlistId,
  productName,
  lastKnownPrice,
  targetPrice: initialTarget,
  alertEnabled: initialAlert = false,
  userId,
  productUrl,
}: PriceTrackerProps) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [targetPrice, setTargetPrice] = useState(initialTarget?.toString() || '');
  const [alertEnabled, setAlertEnabled] = useState(initialAlert);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [wishlistId]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('price_history')
      .select('price, recorded_at')
      .eq('wishlist_id', wishlistId)
      .order('recorded_at', { ascending: false })
      .limit(10);
    if (data) setHistory(data);
  };

  const toggleAlert = async () => {
    const newState = !alertEnabled;
    const updates: any = { price_alert_enabled: newState };
    if (targetPrice) updates.target_price = parseFloat(targetPrice);

    const { error } = await supabase
      .from('wishlists')
      .update(updates)
      .eq('id', wishlistId);

    if (error) {
      toast.error('Failed to update alert');
    } else {
      setAlertEnabled(newState);
      toast.success(newState ? 'Price alert enabled' : 'Price alert disabled');
    }
  };

  const saveTarget = async () => {
    const val = parseFloat(targetPrice);
    if (isNaN(val) || val <= 0) {
      toast.error('Enter a valid target price');
      return;
    }
    const { error } = await supabase
      .from('wishlists')
      .update({ target_price: val, price_alert_enabled: true })
      .eq('id', wishlistId);

    if (error) {
      toast.error('Failed to save target');
    } else {
      setAlertEnabled(true);
      setEditing(false);
      toast.success(`Alert set for $${val.toFixed(2)}`);
    }
  };

  const trend = history.length >= 2
    ? history[0].price < history[1].price ? 'down' : history[0].price > history[1].price ? 'up' : 'stable'
    : null;

  return (
    <div className="space-y-3">
      {/* Current price & trend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {lastKnownPrice ? `$${lastKnownPrice.toFixed(2)}` : 'No price data'}
          </span>
          {trend === 'down' && (
            <Badge className="bg-trusted/10 text-trusted border-trusted/20 text-[10px]" variant="outline">
              <TrendingDown className="w-3 h-3 mr-0.5" /> Dropping
            </Badge>
          )}
          {trend === 'up' && (
            <Badge className="bg-suspicious/10 text-suspicious border-suspicious/20 text-[10px]" variant="outline">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Rising
            </Badge>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAlert}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            alertEnabled
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-foreground'
          )}
          title={alertEnabled ? 'Disable alerts' : 'Enable alerts'}
        >
          {alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Target price */}
      <AnimatePresence>
        {(editing || alertEnabled) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <Input
                type="number"
                step="0.01"
                placeholder="Target price"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="h-8 text-sm rounded-lg"
              />
              <Button size="sm" className="h-8 rounded-lg text-xs" onClick={saveTarget}>
                Set
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini price chart */}
      {history.length > 1 && (
        <div className="flex items-end gap-0.5 h-8">
          {history.slice(0, 8).reverse().map((point, i) => {
            const prices = history.map(h => h.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const range = max - min || 1;
            const height = ((point.price - min) / range) * 100;
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(15, height)}%` }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'flex-1 rounded-sm min-h-[4px]',
                  i === history.length - 1 ? 'bg-primary' : 'bg-primary/30'
                )}
                title={`$${point.price.toFixed(2)}`}
              />
            );
          })}
        </div>
      )}

      {!editing && !alertEnabled && (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-primary hover:underline"
        >
          Set price alert →
        </button>
      )}
    </div>
  );
}
