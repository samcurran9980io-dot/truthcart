import { Button } from '@/components/ui/button';
import { LogOut, Zap, Crown, AlertTriangle, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { type UserPlan, shouldShowWarning, getPlanById } from '@/lib/plans';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
  userPlan?: UserPlan;
}

export function Header({ isAuthenticated, onLogout, userPlan }: HeaderProps) {
  const remaining = userPlan ? userPlan.creditsTotal - userPlan.creditsUsed : 0;
  const showWarning = userPlan ? shouldShowWarning(userPlan) : false;
  const plan = userPlan ? getPlanById(userPlan.planId) : undefined;
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDark(false);
        }
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setIsDark(newDark);
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={logo} alt="TruthCart" className="w-10 h-10 object-contain" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">
            TruthCart
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          {/* Credits Display */}
          {userPlan && (
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link 
                to="/pricing" 
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  showWarning 
                    ? "bg-mixed/10 text-mixed hover:bg-mixed/15" 
                    : "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                {showWarning ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                <span>{remaining}</span>
              </Link>
            </motion.div>
          )}

          {/* Plan Badge */}
          {userPlan && userPlan.planId !== 'free' && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none hidden sm:flex gap-1 px-2.5 py-1">
              <Crown className="w-3 h-3" />
              {plan?.name}
            </Badge>
          )}

          {/* Auth Actions */}
          {isAuthenticated ? (
            <>
              <Link 
                to="/pricing" 
                className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Pricing
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className="rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <Link 
                to="/pricing" 
                className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Pricing
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="sm" 
                  asChild
                  className="rounded-xl shadow-lg shadow-primary/20"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
              </motion.div>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
