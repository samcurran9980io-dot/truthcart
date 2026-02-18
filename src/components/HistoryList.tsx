import { useState } from 'react';
import { HistoryItem } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Clock, ArrowRight, GitCompareArrows } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (id: string) => void;
  onCompare?: (ids: string[]) => void;
  compareMode?: boolean;
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

export function HistoryList({ items, onSelect, onCompare, compareMode = true }: HistoryListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          Recent Analyses
        </div>
        {compareMode && selectedIds.length >= 2 && onCompare && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-1.5 text-xs h-7"
            onClick={() => onCompare(selectedIds)}
          >
            <GitCompareArrows className="w-3 h-3" />
            Compare ({selectedIds.length})
          </Button>
        )}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2"
        >
          {compareMode && items.length >= 2 && (
            <Checkbox
              checked={selectedIds.includes(item.id)}
              onCheckedChange={() => toggleSelect(item.id)}
              disabled={!selectedIds.includes(item.id) && selectedIds.length >= 3}
              className="shrink-0"
            />
          )}
          <button
            onClick={() => onSelect(item.id)}
            className="flex-1 flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-200 text-left group"
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
        </div>
      ))}
    </div>
  );
}
