import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnalysisInput, AnalysisMode } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Zap, Search, Lock, Crown, Sparkles } from 'lucide-react';

interface AnalysisFormProps {
  onSubmit: (input: AnalysisInput) => void;
  isLoading: boolean;
  remainingScans: number;
  canPerformFree: boolean;
  isAuthenticated: boolean;
  hasPremium: boolean;
  onUpgradeClick?: () => void;
}

const placeholders = [
  "e.g. Sony WH-1000XM5 Headphones",
  "e.g. Dyson V15 Detect Vacuum",
  "e.g. Apple AirPods Pro 2",
  "e.g. Samsung Galaxy S24 Ultra",
];

export function AnalysisForm({
  onSubmit,
  isLoading,
  remainingScans,
  canPerformFree,
  isAuthenticated,
  hasPremium,
  onUpgradeClick,
}: AnalysisFormProps) {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [mode, setMode] = useState<AnalysisMode>('fast');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Animated placeholder cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName.trim() || !productUrl.trim()) return;
    
    onSubmit({
      productName: productName.trim(),
      brand: brand.trim() || undefined,
      productUrl: productUrl.trim(),
      mode,
    });
  };

  const canSubmitFast = canPerformFree || isAuthenticated;
  const canSubmitDeep = isAuthenticated && hasPremium;
  const canSubmit = mode === 'fast' ? canSubmitFast : canSubmitDeep;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="bg-card rounded-3xl overflow-hidden shadow-premium-xl border border-border/50"
    >
      {/* Premium Header */}
      <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 p-8 md:p-10 text-center overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-sm mb-5"
        >
          <Sparkles className="w-7 h-7 text-primary" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="relative text-2xl md:text-3xl font-bold text-background mb-3"
        >
          The Product Reality Check
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="relative text-background/60 text-sm md:text-base max-w-md mx-auto"
        >
          We ignore official reviews and analyze real community discussions.
        </motion.p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Product Name Input - Hero Input */}
        <div className="space-y-2">
          <Label htmlFor="productName" className="text-foreground font-medium text-sm">
            Product Name <span className="text-primary">*</span>
          </Label>
          <div className={cn(
            "relative rounded-2xl transition-all duration-300",
            isFocused && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
          )}>
            <Input
              id="productName"
              placeholder={placeholders[placeholderIndex]}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              required
              className="h-14 text-base md:text-lg bg-secondary/50 border-border/50 rounded-2xl px-5 placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50"
            />
          </div>
        </div>

        {/* Brand & URL Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-foreground font-medium text-sm">
              Brand <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="brand"
              placeholder="e.g. Sony"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={isLoading}
              className="h-12 bg-secondary/50 border-border/50 rounded-xl px-4 placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productUrl" className="text-foreground font-medium text-sm">
              Product URL <span className="text-primary">*</span>
            </Label>
            <Input
              id="productUrl"
              type="url"
              placeholder="https://amazon.com/..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 bg-secondary/50 border-border/50 rounded-xl px-4 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Mode Selection - Segmented Control */}
        <div className="space-y-3">
          <Label className="text-foreground font-medium text-sm">Analysis Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={() => setMode('fast')}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'relative p-5 rounded-2xl border-2 transition-all duration-200 text-center group',
                mode === 'fast'
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-border/50 hover:border-primary/30 bg-secondary/30'
              )}
            >
              <div className="flex justify-center mb-3">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
                  mode === 'fast' ? 'bg-primary/15' : 'bg-muted'
                )}>
                  <Zap className={cn(
                    'w-5 h-5 transition-colors',
                    mode === 'fast' ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
              </div>
              <span className={cn(
                'font-semibold text-sm block',
                mode === 'fast' ? 'text-primary' : 'text-foreground'
              )}>
                Quick Scan
              </span>
              <p className={cn(
                'text-xs mt-1',
                mode === 'fast' ? 'text-primary/70' : 'text-muted-foreground'
              )}>
                1 credit · Instant
              </p>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setMode('deep')}
              disabled={isLoading || !isAuthenticated}
              whileHover={{ scale: isAuthenticated ? 1.01 : 1 }}
              whileTap={{ scale: isAuthenticated ? 0.99 : 1 }}
              className={cn(
                'relative p-5 rounded-2xl border-2 transition-all duration-200 text-center group',
                mode === 'deep'
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-border/50 hover:border-primary/30 bg-secondary/30',
                !isAuthenticated && 'opacity-60 cursor-not-allowed'
              )}
            >
              {!hasPremium && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="w-6 h-6 rounded-full bg-mixed flex items-center justify-center">
                    <Crown className="w-3.5 h-3.5 text-background" />
                  </div>
                </div>
              )}
              <div className="flex justify-center mb-3">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-colors",
                  mode === 'deep' ? 'bg-primary/15' : 'bg-muted'
                )}>
                  <Search className={cn(
                    'w-5 h-5 transition-colors',
                    mode === 'deep' ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
              </div>
              <span className={cn(
                'font-semibold text-sm block',
                mode === 'deep' ? 'text-primary' : 'text-foreground'
              )}>
                Deep Research
              </span>
              <p className={cn(
                'text-xs mt-1',
                mode === 'deep' ? 'text-primary/70' : 'text-muted-foreground'
              )}>
                3 credits · Full analysis
              </p>
            </motion.button>
          </div>
        </div>

        {/* Usage Info */}
        <AnimatePresence mode="wait">
          {!isAuthenticated && mode === 'fast' && (
            <motion.div
              key="free-scans"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span>
                {remainingScans} free scan{remainingScans !== 1 ? 's' : ''} remaining
              </span>
            </motion.div>
          )}

          {!canPerformFree && !isAuthenticated && mode === 'fast' && (
            <motion.div
              key="limit-reached"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-sm text-mixed bg-mixed/10 p-4 rounded-xl border border-mixed/20"
            >
              <Lock className="w-4 h-4" />
              <span>Free limit reached. Sign in to continue.</span>
            </motion.div>
          )}

          {mode === 'deep' && !isAuthenticated && (
            <motion.div
              key="sign-in-deep"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl"
            >
              <Lock className="w-4 h-4" />
              <span>Sign in to access Deep Research</span>
            </motion.div>
          )}

          {mode === 'deep' && isAuthenticated && !hasPremium && (
            <motion.button
              key="upgrade-prompt"
              type="button"
              onClick={onUpgradeClick}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-between text-sm text-mixed bg-mixed/10 p-4 rounded-xl border border-mixed/20 hover:bg-mixed/15 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span>Upgrade to unlock Deep Research</span>
              </div>
              <span className="text-xs font-semibold bg-mixed/20 px-2 py-1 rounded-full">From $4.99/mo</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            type="submit"
            size="lg"
            className={cn(
              "w-full h-14 text-base font-semibold rounded-2xl transition-all duration-300",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "shadow-lg hover:shadow-xl hover:shadow-primary/20",
              isLoading && "animate-pulse"
            )}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Reveal Product Truth
              </span>
            )}
          </Button>
        </motion.div>

        {/* Powered By */}
        <p className="text-center text-xs text-muted-foreground/60">
          Powered by Gemini AI
        </p>
      </form>
    </motion.div>
  );
}
