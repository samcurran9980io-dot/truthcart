import { useEffect, useState } from 'react';
import { TrustStatus } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface TrustGaugeProps {
  score: number;
  status: TrustStatus;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const statusConfig = {
  trusted: {
    colorClass: 'text-trusted',
    strokeClass: 'stroke-trusted',
  },
  mixed: {
    colorClass: 'text-mixed',
    strokeClass: 'stroke-mixed',
  },
  suspicious: {
    colorClass: 'text-suspicious',
    strokeClass: 'stroke-suspicious',
  },
};

const sizeConfig = {
  sm: { width: 80, strokeWidth: 6, fontSize: 'text-2xl' },
  md: { width: 100, strokeWidth: 7, fontSize: 'text-3xl' },
  lg: { width: 120, strokeWidth: 8, fontSize: 'text-4xl' },
};

export function TrustGauge({ score, status, size = 'md', animated = true }: TrustGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const config = statusConfig[status];
  const sizeConf = sizeConfig[size];
  
  const radius = (sizeConf.width - sizeConf.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const offset = circumference - progress;
  
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }
    
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      
      setDisplayScore(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score, animated]);
  
  return (
    <div className="relative" style={{ width: sizeConf.width, height: sizeConf.width }}>
      <svg
        className="transform -rotate-90"
        width={sizeConf.width}
        height={sizeConf.width}
      >
        {/* Background circle */}
        <circle
          cx={sizeConf.width / 2}
          cy={sizeConf.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={sizeConf.strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={sizeConf.width / 2}
          cy={sizeConf.width / 2}
          r={radius}
          fill="none"
          strokeWidth={sizeConf.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(config.strokeClass, 'transition-all duration-300')}
        />
      </svg>
      
      {/* Center score - just the number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('font-display font-bold', sizeConf.fontSize, config.colorClass)}>
          {displayScore}
        </span>
      </div>
    </div>
  );
}