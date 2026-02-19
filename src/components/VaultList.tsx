import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Pin, Share2, Trash2, PinOff, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VaultItem {
  id: string;
  product_name: string;
  trust_score: number;
  status: string;
  mode: string;
  pinned: boolean;
  created_at: string;
}

interface VaultListProps {
  items: VaultItem[];
  onSelect: (id: string) => void;
  onRefresh: () => void;
  isAuthenticated: boolean;
}

const statusColors: Record<string, string> = {
  trusted: 'text-trusted',
  mixed: 'text-mixed',
  suspicious: 'text-suspicious',
};

export function VaultList({ items, onSelect, onRefresh, isAuthenticated }: VaultListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePin = async (e: React.MouseEvent, id: string, currentPinned: boolean) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('scans')
      .update({ pinned: !currentPinned })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update pin');
    } else {
      toast.success(currentPinned ? 'Unpinned' : 'Pinned to top');
      onRefresh();
    }
  };

  const handleShare = (e: React.MouseEvent, item: VaultItem) => {
    e.stopPropagation();
    const url = `${window.location.origin}/report/${item.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Report link copied to clipboard!');
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    const { error } = await supabase.from('scans').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete scan');
    } else {
      toast.success('Scan deleted');
      onRefresh();
    }
    setDeletingId(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{isAuthenticated ? 'No scans yet' : 'Sign in to save scans'}</p>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-3">
        <Bookmark className="w-3.5 h-3.5" />
        Your Vault
      </div>
      <AnimatePresence>
        {sorted.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => onSelect(item.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-200 text-left group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {item.pinned && <Pin className="w-3 h-3 text-primary flex-shrink-0" />}
                  <p className="font-medium text-foreground truncate text-sm">{item.product_name}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(item.created_at), 'dd/MM/yyyy')}
                  {' · '}
                  <span className={cn('font-medium', statusColors[item.status] || 'text-muted-foreground')}>
                    {item.trust_score}/100
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handlePin(e, item.id, item.pinned)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                  title={item.pinned ? 'Unpin' : 'Pin to top'}
                >
                  {item.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={(e) => handleShare(e, item)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                  title="Share report"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete scan"
                  disabled={deletingId === item.id}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
