import { motion } from 'framer-motion';
import { CommunitySignal } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Quote, ExternalLink } from 'lucide-react';

interface CommunityQuoteProps {
  signal: CommunitySignal;
  delay?: number;
}

const sentimentConfig = {
  positive: {
    label: 'Positive',
    bgClass: 'bg-trusted/5',
    textClass: 'text-trusted',
    borderClass: 'border-trusted/30',
    dotClass: 'bg-trusted',
  },
  negative: {
    label: 'Concern',
    bgClass: 'bg-suspicious/5',
    textClass: 'text-suspicious',
    borderClass: 'border-suspicious/30',
    dotClass: 'bg-suspicious',
  },
  neutral: {
    label: 'Mixed',
    bgClass: 'bg-mixed/5',
    textClass: 'text-mixed',
    borderClass: 'border-mixed/30',
    dotClass: 'bg-mixed',
  },
};

export function CommunityQuote({ signal, delay = 0 }: CommunityQuoteProps) {
  const config = sentimentConfig[signal.sentiment];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative p-4 rounded-2xl border transition-colors hover:bg-secondary/50',
        config.bgClass,
        config.borderClass
      )}
    >
      {/* Quote icon watermark */}
      <Quote className="absolute top-3 right-3 w-6 h-6 text-muted-foreground/10" />
      
      {/* Sentiment badge */}
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('w-1.5 h-1.5 rounded-full', config.dotClass)} />
        <span className={cn('text-[10px] font-semibold uppercase tracking-wider', config.textClass)}>
          {config.label}
        </span>
      </div>
      
      {/* Quote text */}
      <p className="text-sm text-foreground leading-relaxed pr-6">
        "{signal.quote}"
      </p>
      
      {/* Source */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {signal.source}
        </span>
        {signal.sourceUrl && (
          <a 
            href={signal.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            View <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
