import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BreakdownBarProps {
  label: string;
  score: number;
  description?: string;
  delay?: number;
}

const getScoreColor = (score: number) => {
  if (score >= 70) return { bar: 'bg-trusted', text: 'text-trusted' };
  if (score >= 40) return { bar: 'bg-mixed', text: 'text-mixed' };
  return { bar: 'bg-suspicious', text: 'text-suspicious' };
};

export function BreakdownBar({ label, score, description, delay = 0 }: BreakdownBarProps) {
  const colors = getScoreColor(score);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn('text-sm font-bold', colors.text)}>
          {score}%
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: (delay + 200) / 1000, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={cn('h-full rounded-full', colors.bar)}
        />
      </div>
      
      {/* Description tooltip on hover */}
      {description && (
        <p className="text-xs text-muted-foreground mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {description}
        </p>
      )}
    </motion.div>
  );
}
