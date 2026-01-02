import { Button } from '@/components/ui/button';
import { ShieldCheck, User, LogOut, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
  hasPremium?: boolean;
  onUpgradeClick?: () => void;
}

export function Header({ isAuthenticated, onLogout, hasPremium, onUpgradeClick }: HeaderProps) {
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
          {isAuthenticated ? (
            <>
              {hasPremium ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Premium</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUpgradeClick}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Crown className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Upgrade</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}