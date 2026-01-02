import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

interface LoadingStep {
  label: string;
  duration: number;
}

const steps: LoadingStep[] = [
  { label: 'Scanning community discussions…', duration: 2000 },
  { label: 'Detecting promotional patterns…', duration: 1800 },
  { label: 'Measuring reality gaps…', duration: 2200 },
  { label: 'Finalizing trust score…', duration: 1500 },
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
    <div className="w-full max-w-md mx-auto space-y-4 p-6">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
      
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;
        
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
              isCurrent && 'bg-primary/5',
              isCompleted && 'bg-trusted/5'
            )}
          >
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
              isCompleted && 'bg-trusted text-primary-foreground',
              isCurrent && 'bg-primary text-primary-foreground',
              isPending && 'bg-muted text-muted-foreground'
            )}>
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
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
  );
}
