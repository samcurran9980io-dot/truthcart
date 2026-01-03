import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, AlertTriangle, Crown, ChevronRight } from 'lucide-react';
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium",
          showWarning 
            ? "bg-mixed/10 text-mixed" 
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
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="bg-card rounded-3xl p-6 shadow-premium border border-border/50"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Your Credits</h3>
          {plan && (
            <Badge variant="secondary" className="text-xs bg-secondary/50">
              {plan.name}
            </Badge>
          )}
        </div>
        {showWarning && (
          <Badge variant="destructive" className="text-xs bg-mixed/10 text-mixed border-mixed/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low
          </Badge>
        )}
      </div>

      <div className="mb-5">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-4xl font-bold text-foreground">{remaining}</span>
          <span className="text-sm text-muted-foreground">of {userPlan.creditsTotal}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${100 - percentage}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "h-full rounded-full transition-colors",
              showWarning ? "bg-mixed" : "bg-primary"
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-5 p-3 bg-secondary/30 rounded-xl">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span>{Math.floor(remaining / CREDIT_COSTS.quickScan)} Quick Scans</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-primary" />
          <span>{Math.floor(remaining / CREDIT_COSTS.deepResearch)} Deep Research</span>
        </div>
      </div>

      {userPlan.planId !== 'pro' && showUpgradeButton && (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full rounded-xl group" 
            asChild
          >
            <Link to="/pricing" className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <span>Upgrade for More</span>
              <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Resets {new Date(userPlan.renewsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
    </motion.div>
  );
}
