import { cn } from '@/lib/utils';

interface BreakdownBarProps {
  label: string;
  score: number;
  description?: string;
  delay?: number;
}

const getScoreIcon = (label: string): string => {
  const icons: Record<string, string> = {
    'Reality Gap': '∞',
    'Promotional Noise': '$',
    'Timing Anomalies': '⌚',
    'Community Complaints': '☺',
    'Feedback Diversity': '≠',
  };
  return icons[label] || '●';
};

const getScoreColor = (score: number): string => {
  if (score <= 30) return 'text-trusted';
  if (score <= 60) return 'text-mixed';
  return 'text-suspicious';
};

export function BreakdownBar({ label, score, description, delay = 0 }: BreakdownBarProps) {
  return (
    <div 
      className="animate-slide-in opacity-0"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{getScoreIcon(label)}</span>
          <span className="text-sm text-foreground">{label}</span>
        </div>
        <span className={cn('text-sm font-bold', getScoreColor(score))}>
          {score}%
        </span>
      </div>
    </div>
  );
}