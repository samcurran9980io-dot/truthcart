import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Search, Shield, MessageSquare, Brain, Sparkles } from 'lucide-react';

interface LoadingStep {
  label: string;
  duration: number;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: LoadingStep[] = [
  { label: 'Scanning community discussions...', duration: 2000, icon: Search },
  { label: 'Filtering promotional content...', duration: 1800, icon: Shield },
  { label: 'Analyzing sentiment patterns...', duration: 2000, icon: MessageSquare },
  { label: 'Processing AI insights...', duration: 2200, icon: Brain },
  { label: 'Generating your Trust Score...', duration: 1500, icon: Sparkles },
];

interface LoadingStepsProps {
  isLoading: boolean;
}

export function LoadingSteps({ isLoading }: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setProgress(0);
      return;
    }

    let timeout: NodeJS.Timeout;
    let stepIndex = 0;
    let progressInterval: NodeJS.Timeout;

    const advanceStep = () => {
      if (stepIndex < steps.length - 1) {
        setCompletedSteps(prev => [...prev, stepIndex]);
        stepIndex++;
        setCurrentStep(stepIndex);
        timeout = setTimeout(advanceStep, steps[stepIndex].duration);
      }
    };

    // Smooth progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        const target = ((stepIndex + 1) / steps.length) * 100;
        const diff = target - prev;
        return prev + diff * 0.1;
      });
    }, 50);

    timeout = setTimeout(advanceStep, steps[0].duration);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-lg mx-auto py-16 px-6"
    >
      {/* Animated Logo/Icon */}
      <div className="flex justify-center mb-10">
        <motion.div 
          className="relative"
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Outer glow ring */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Main circle with spinning border */}
          <div className="relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              {/* Progress arc */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={283}
                strokeDashoffset={283 - (progress / 100) * 283}
                className="origin-center -rotate-90"
                style={{ transformOrigin: '50% 50%' }}
              />
            </svg>
            
            {/* Center icon */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl md:text-2xl font-semibold text-center text-foreground mb-2"
      >
        Analyzing Product
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground text-center mb-10"
      >
        This usually takes 10-15 seconds
      </motion.p>
      
      {/* Steps */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;
            const Icon = step.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isPending ? 0.4 : 1, 
                  x: 0,
                  scale: isCurrent ? 1.02 : 1
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl transition-all duration-300',
                  isCurrent && 'bg-primary/5 border border-primary/20',
                  isCompleted && 'bg-secondary/50',
                  isPending && 'bg-transparent'
                )}
              >
                <motion.div 
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300',
                    isCompleted && 'bg-trusted text-background',
                    isCurrent && 'bg-primary text-primary-foreground',
                    isPending && 'bg-muted text-muted-foreground'
                  )}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.div>
                
                <span className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  isCompleted && 'text-muted-foreground',
                  isCurrent && 'text-foreground',
                  isPending && 'text-muted-foreground/60'
                )}>
                  {step.label}
                </span>

                {isCurrent && (
                  <motion.div 
                    className="ml-auto flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ 
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
