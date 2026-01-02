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
    label: 'Trusted',
    colorClass: 'text-trusted',
    strokeClass: 'stroke-trusted',
    bgClass: 'bg-trusted/10',
  },
  mixed: {
    label: 'Mixed',
    colorClass: 'text-mixed',
    strokeClass: 'stroke-mixed',
    bgClass: 'bg-mixed/10',
  },
  suspicious: {
    label: 'Suspicious',
    colorClass: 'text-suspicious',
    strokeClass: 'stroke-suspicious',
    bgClass: 'bg-suspicious/10',
  },
};

const sizeConfig = {
  sm: { width: 100, strokeWidth: 8, fontSize: 'text-2xl', labelSize: 'text-xs' },
  md: { width: 160, strokeWidth: 10, fontSize: 'text-4xl', labelSize: 'text-sm' },
  lg: { width: 220, strokeWidth: 12, fontSize: 'text-5xl', labelSize: 'text-base' },
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
    
    let start = 0;
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
    <div className="flex flex-col items-center gap-3">
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
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-display font-bold', sizeConf.fontSize, config.colorClass)}>
            {displayScore}
          </span>
          <span className={cn('text-muted-foreground', sizeConf.labelSize)}>
            / 100
          </span>
        </div>
      </div>
      
      {/* Status badge */}
      <div className={cn(
        'px-4 py-1.5 rounded-full font-medium',
        config.bgClass,
        config.colorClass,
        sizeConf.labelSize
      )}>
        {config.label}
      </div>
    </div>
  );
}
