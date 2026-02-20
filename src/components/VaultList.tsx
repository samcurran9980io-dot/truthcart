import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Pin, Share2, Trash2, PinOff, Bookmark, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [search, setSearch] = useState('');
  const [clearingAll, setClearingAll] = useState(false);

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

  const handleClearAll = async () => {
    if (!window.confirm('Delete all scans from your Vault? This cannot be undone.')) return;
    setClearingAll(true);
    const ids = items.map((i) => i.id);
    const { error } = await supabase.from('scans').delete().in('id', ids);
    if (error) {
      toast.error('Failed to clear vault');
    } else {
      toast.success('Vault cleared');
      onRefresh();
    }
    setClearingAll(false);
  };

  const sorted = useMemo(() => {
    return [...items]
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
      .filter((item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase())
      );
  }, [items, search]);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{isAuthenticated ? 'No scans yet' : 'Sign in to save scans'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
          <Bookmark className="w-3.5 h-3.5" />
          Your Vault
        </div>
        {isAuthenticated && items.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearingAll}
            className="text-xs text-destructive/70 hover:text-destructive transition-colors font-medium flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      {items.length > 2 && (
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vault..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XCircle className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {sorted.length === 0 && search && (
        <p className="text-xs text-muted-foreground text-center py-4">No results for "{search}"</p>
      )}
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
