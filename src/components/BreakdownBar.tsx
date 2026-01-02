import { cn } from '@/lib/utils';

interface BreakdownBarProps {
  label: string;
  score: number;
  description: string;
  delay?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'bg-trusted';
  if (score >= 40) return 'bg-mixed';
  return 'bg-suspicious';
}

export function BreakdownBar({ label, score, description, delay = 0 }: BreakdownBarProps) {
  return (
    <div 
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-muted-foreground">{score}/100</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', getScoreColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
