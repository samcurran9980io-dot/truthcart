import { Link } from 'react-router-dom';
import { Crown, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type PlanId } from '@/lib/plans';
import { cn } from '@/lib/utils';

interface UpgradePromptProps {
  reason: 'no-credits' | 'deep-research-locked' | 'limit-reached';
  currentPlan: PlanId;
  variant?: 'inline' | 'modal';
}

export function UpgradePrompt({ reason, currentPlan, variant = 'inline' }: UpgradePromptProps) {
  const messages = {
    'no-credits': {
      icon: Zap,
      title: "You're out of credits",
      description: "Upgrade your plan to continue analyzing products and making informed decisions.",
      cta: "Get More Credits",
    },
    'deep-research-locked': {
      icon: Crown,
      title: "Deep Research is Premium",
      description: "Unlock comprehensive analysis with patterns, risks, and community insights.",
      cta: "Unlock Deep Research",
    },
    'limit-reached': {
      icon: Zap,
      title: "Free limit reached",
      description: "You've used all 10 free scans. Sign up for a plan to keep checking products.",
      cta: "View Plans",
    },
  };

  const message = messages[reason];
  const Icon = message.icon;

  if (variant === 'modal') {
    return (
      <div className="text-center p-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">{message.title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {message.description}
        </p>
        <Button size="lg" className="w-full max-w-xs" asChild>
          <Link to="/pricing">
            {message.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        {currentPlan === 'free' && (
          <p className="text-sm text-muted-foreground mt-4">
            Plans start at just <span className="font-medium text-foreground">$4.99/month</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl border",
      reason === 'no-credits' 
        ? "bg-destructive/5 border-destructive/20" 
        : "bg-primary/5 border-primary/20"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
        reason === 'no-credits' ? "bg-destructive/10" : "bg-primary/10"
      )}>
        <Icon className={cn(
          "w-5 h-5",
          reason === 'no-credits' ? "text-destructive" : "text-primary"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{message.title}</p>
        <p className="text-sm text-muted-foreground truncate">{message.description}</p>
      </div>
      <Button size="sm" asChild>
        <Link to="/pricing">
          {message.cta}
        </Link>
      </Button>
    </div>
  );
}
