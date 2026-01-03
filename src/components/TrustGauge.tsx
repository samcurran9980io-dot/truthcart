import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    bgClass: 'bg-trusted/10',
  },
  mixed: {
    colorClass: 'text-mixed',
    strokeClass: 'stroke-mixed',
    bgClass: 'bg-mixed/10',
  },
  suspicious: {
    colorClass: 'text-suspicious',
    strokeClass: 'stroke-suspicious',
    bgClass: 'bg-suspicious/10',
  },
};

const sizeConfig = {
  sm: { width: 80, strokeWidth: 5, fontSize: 'text-2xl', labelSize: 'text-[8px]' },
  md: { width: 120, strokeWidth: 6, fontSize: 'text-4xl', labelSize: 'text-[10px]' },
  lg: { width: 160, strokeWidth: 7, fontSize: 'text-5xl', labelSize: 'text-xs' },
};

export function TrustGauge({ score, status, size = 'md', animated = true }: TrustGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const config = statusConfig[status];
  const sizeConf = sizeConfig[size];
  
  const radius = (sizeConf.width - sizeConf.strokeWidth * 2) / 2;
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
      
      // Easing function - ease out cubic
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
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative" 
      style={{ width: sizeConf.width, height: sizeConf.width }}
    >
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full blur-xl opacity-30 transition-opacity duration-500",
          config.bgClass
        )}
        style={{ 
          transform: 'scale(1.1)',
        }}
      />
      
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
          className="text-muted/50"
        />
        {/* Progress circle */}
        <motion.circle
          cx={sizeConf.width / 2}
          cy={sizeConf.width / 2}
          r={radius}
          fill="none"
          strokeWidth={sizeConf.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(config.strokeClass, 'drop-shadow-sm')}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      
      {/* Center score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={cn('font-bold tracking-tight', sizeConf.fontSize, config.colorClass)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {displayScore}
        </motion.span>
      </div>
    </motion.div>
  );
}
