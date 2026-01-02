import { CommunitySignal } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface CommunityQuoteProps {
  signal: CommunitySignal;
  delay?: number;
}

const sentimentConfig = {
  positive: {
    label: 'POSITIVE',
    bgClass: 'bg-trusted/10',
    textClass: 'text-trusted',
    borderClass: 'border-l-trusted',
  },
  negative: {
    label: 'NEGATIVE',
    bgClass: 'bg-suspicious/10',
    textClass: 'text-suspicious',
    borderClass: 'border-l-suspicious',
  },
  neutral: {
    label: 'MIXED',
    bgClass: 'bg-mixed/10',
    textClass: 'text-mixed',
    borderClass: 'border-l-mixed',
  },
};

export function CommunityQuote({ signal, delay = 0 }: CommunityQuoteProps) {
  const config = sentimentConfig[signal.sentiment];
  
  return (
    <div 
      className={cn(
        'border-l-4 pl-3 py-2 animate-slide-in opacity-0',
        config.borderClass
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={cn(
          'text-[10px] font-bold uppercase tracking-wider',
          config.textClass
        )}>
          {config.label}
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        "{signal.quote}"
      </p>
      <p className="text-xs text-muted-foreground mt-1 uppercase">
        {signal.source}
      </p>
    </div>
  );
}