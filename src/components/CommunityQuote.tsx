import { CommunitySignal } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface CommunityQuoteProps {
  signal: CommunitySignal;
  delay?: number;
}

const sentimentConfig = {
  positive: {
    borderColor: 'border-l-trusted',
    iconColor: 'text-trusted',
  },
  neutral: {
    borderColor: 'border-l-muted-foreground',
    iconColor: 'text-muted-foreground',
  },
  negative: {
    borderColor: 'border-l-suspicious',
    iconColor: 'text-suspicious',
  },
};

export function CommunityQuote({ signal, delay = 0 }: CommunityQuoteProps) {
  const config = sentimentConfig[signal.sentiment];
  
  return (
    <div 
      className={cn(
        'p-4 bg-muted/50 rounded-lg border-l-4 animate-slide-in opacity-0',
        config.borderColor
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-3">
        <Quote className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground italic">"{signal.quote}"</p>
          <p className="mt-2 text-xs text-muted-foreground">— {signal.source}</p>
        </div>
      </div>
    </div>
  );
}
