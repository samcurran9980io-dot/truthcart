import { HistoryItem } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (id: string) => void;
}

const statusColors = {
  trusted: 'text-trusted',
  mixed: 'text-mixed',
  suspicious: 'text-suspicious',
};

export function HistoryList({ items, onSelect }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No scan history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors duration-200 text-left group"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{item.productName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.analyzedAt), { addSuffix: true })}
              {' · '}
              <span className="capitalize">{item.mode} Scan</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('font-bold text-lg', statusColors[item.status])}>
              {item.trustScore}
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      ))}
    </div>
  );
}
