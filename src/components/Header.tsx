import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut, Zap, Crown, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { type UserPlan, getCreditsRemaining, shouldShowWarning, getPlanById } from '@/lib/plans';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
  userPlan?: UserPlan;
}

export function Header({ isAuthenticated, onLogout, userPlan }: HeaderProps) {
  const remaining = userPlan ? userPlan.creditsTotal - userPlan.creditsUsed : 0;
  const showWarning = userPlan ? shouldShowWarning(userPlan) : false;
  const plan = userPlan ? getPlanById(userPlan.planId) : undefined;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">TruthCart</span>
        </Link>

        <nav className="flex items-center gap-3">
          {/* Credits Display */}
          {userPlan && (
            <Link 
              to="/pricing" 
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-80",
                showWarning 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-primary/10 text-primary"
              )}
            >
              {showWarning ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <Zap className="w-3.5 h-3.5" />
              )}
              <span>{remaining} credits</span>
            </Link>
          )}

          {/* Plan Badge */}
          {userPlan && userPlan.planId !== 'free' && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none hidden sm:flex">
              <Crown className="w-3 h-3 mr-1" />
              {plan?.name}
            </Badge>
          )}

          {/* Auth Actions */}
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/pricing">Pricing</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}