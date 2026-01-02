import { HistoryItem } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (id: string) => void;
}

const statusColors = {
  trusted: 'text-trusted',
  mixed: 'text-mixed',
  suspicious: 'text-suspicious',
};

const statusLabels = {
  trusted: 'Trusted',
  mixed: 'Mixed',
  suspicious: 'Suspicious',
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
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-3">
        <Clock className="w-3.5 h-3.5" />
        Recent Analyses
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-200 text-left group"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate text-sm">{item.productName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(item.analyzedAt), 'dd/MM/yyyy')}
              {' · '}
              <span className={cn('font-medium', statusColors[item.status])}>
                {statusLabels[item.status]} ({item.trustScore})
              </span>
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
        </button>
      ))}
    </div>
  );
}