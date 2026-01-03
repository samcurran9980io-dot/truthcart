import { Link } from 'react-router-dom';
import { Zap, AlertTriangle, Crown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  type UserPlan, 
  getCreditsRemaining, 
  getCreditsPercentage, 
  shouldShowWarning,
  getPlanById,
  CREDIT_COSTS 
} from '@/lib/plans';
import { cn } from '@/lib/utils';

interface CreditDisplayProps {
  userPlan: UserPlan;
  variant?: 'compact' | 'full';
  showUpgradeButton?: boolean;
}

export function CreditDisplay({ userPlan, variant = 'compact', showUpgradeButton = true }: CreditDisplayProps) {
  const remaining = getCreditsRemaining(userPlan);
  const percentage = getCreditsPercentage(userPlan);
  const showWarning = shouldShowWarning(userPlan);
  const plan = getPlanById(userPlan.planId);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
          showWarning 
            ? "bg-destructive/10 text-destructive" 
            : "bg-primary/10 text-primary"
        )}>
          {showWarning ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <Zap className="w-3.5 h-3.5" />
          )}
          <span>{remaining} credits</span>
        </div>
        {userPlan.planId === 'pro' && (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Your Credits</h3>
          {plan && (
            <Badge variant="secondary" className="text-xs">
              {plan.name}
            </Badge>
          )}
        </div>
        {showWarning && (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Running Low
          </Badge>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-bold text-foreground">{remaining}</span>
          <span className="text-sm text-muted-foreground">of {userPlan.creditsTotal} remaining</span>
        </div>
        <Progress 
          value={100 - percentage} 
          className={cn(
            "h-2",
            showWarning && "[&>div]:bg-destructive"
          )}
        />
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>{Math.floor(remaining / CREDIT_COSTS.quickScan)} Quick Scans left</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5" />
          <span>{Math.floor(remaining / CREDIT_COSTS.deepResearch)} Deep Research left</span>
        </div>
      </div>

      {userPlan.planId !== 'pro' && showUpgradeButton && (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/pricing">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade for More Credits
          </Link>
        </Button>
      )}

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Resets {new Date(userPlan.renewsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
    </div>
  );
}
