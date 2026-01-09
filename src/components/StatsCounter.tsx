import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Shield } from 'lucide-react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-6"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">
            <AnimatedCounter end={12847} duration={2.5} />
          </span>
          <span className="text-xs text-muted-foreground">Products Analyzed</span>
        </div>
      </div>

      <div className="w-px h-10 bg-border hidden md:block" />

      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">
            <AnimatedCounter end={4293} duration={2} />
          </span>
          <span className="text-xs text-muted-foreground">Happy Users</span>
        </div>
      </div>

      <div className="w-px h-10 bg-border hidden md:block" />

      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-9 h-9 rounded-xl bg-trusted/10 flex items-center justify-center">
          <Shield className="w-4 h-4 text-trusted" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">
            <AnimatedCounter end={98} duration={1.5} suffix="%" />
          </span>
          <span className="text-xs text-muted-foreground">Accuracy Rate</span>
        </div>
      </div>
    </motion.div>
  );
}
