import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, FileSearch } from 'lucide-react';

interface LoadingStep {
  label: string;
  duration: number;
}

const steps: LoadingStep[] = [
  { label: 'Scanning Reddit & YouTube for user discussions...', duration: 2000 },
  { label: 'Filtering out bot spam and promo content...', duration: 1800 },
  { label: 'Detecting hidden affiliate language...', duration: 2000 },
  { label: 'Analyzing sentiment across communities...', duration: 2200 },
  { label: 'Finalizing your Trust Score...', duration: 1500 },
];

interface LoadingStepsProps {
  isLoading: boolean;
}

export function LoadingSteps({ isLoading }: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let timeout: NodeJS.Timeout;
    let stepIndex = 0;

    const advanceStep = () => {
      if (stepIndex < steps.length - 1) {
        setCompletedSteps(prev => [...prev, stepIndex]);
        stepIndex++;
        setCurrentStep(stepIndex);
        timeout = setTimeout(advanceStep, steps[stepIndex].duration);
      }
    };

    timeout = setTimeout(advanceStep, steps[0].duration);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="w-full max-w-md mx-auto py-16 px-6">
      {/* Circular Progress with Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Spinning ring */}
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            {/* Animated progress arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="264"
              strokeDashoffset="66"
              className="origin-center animate-spin"
              style={{ animationDuration: '2s' }}
            />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileSearch className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-display text-xl font-semibold text-center text-foreground mb-8">
        Analyzing Product Authenticity
      </h2>
      
      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;
          
          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 transition-all duration-300',
                isPending && 'opacity-40'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                isCompleted && 'bg-trusted text-white',
                isCurrent && 'bg-primary text-white',
                isPending && 'bg-muted text-muted-foreground border border-border'
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                )}
              </div>
              <span className={cn(
                'text-sm font-medium transition-colors duration-300',
                isCompleted && 'text-trusted',
                isCurrent && 'text-foreground',
                isPending && 'text-muted-foreground'
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}