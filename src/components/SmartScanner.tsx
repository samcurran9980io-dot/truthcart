import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Zap, Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnalysisInput, AnalysisMode } from '@/types/analysis';

export interface SmartScannerRef {
  triggerSubmit: () => void;
  setFields: (fields: { productName?: string; productUrl?: string }) => void;
}

interface SmartScannerProps {
  onSubmit: (input: AnalysisInput) => void;
  isLoading: boolean;
  remainingScans: number;
  canPerformFree: boolean;
  isAuthenticated: boolean;
  hasPremium: boolean;
  onUpgradeClick?: () => void;
  initialProductName?: string;
  initialProductUrl?: string;
}

const placeholders = [
  "Paste any product link or name...",
  "https://amazon.com/dp/B08...",
  "Sony WH-1000XM5 Headphones",
  "Check this out! https://ebay.com/...",
];

function extractUrl(text: string): { url: string; name: string } {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const match = text.match(urlRegex);
  if (match && match[0]) {
    const url = match[0].replace(/[,.)}\]]+$/, '');
    const name = text.replace(urlRegex, '').replace(/[!?,.\s]+/g, ' ').trim();
    return { url, name };
  }
  return { url: '', name: text.trim() };
}

export const SmartScanner = forwardRef<SmartScannerRef, SmartScannerProps>(({
  onSubmit,
  isLoading,
  remainingScans,
  canPerformFree,
  isAuthenticated,
  hasPremium,
  onUpgradeClick,
  initialProductName = '',
  initialProductUrl = '',
}, ref) => {
  const [input, setInput] = useState(initialProductUrl || initialProductName);
  const [mode, setMode] = useState<AnalysisMode>('fast');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (initialProductUrl) setInput(initialProductUrl);
    else if (initialProductName) setInput(initialProductName);
  }, [initialProductName, initialProductUrl]);

  useImperativeHandle(ref, () => ({
    triggerSubmit: () => {
      if (input.trim()) handleSubmit();
    },
    setFields: (fields) => {
      if (fields.productUrl) setInput(fields.productUrl);
      else if (fields.productName) setInput(fields.productName);
    },
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const { url, name } = extractUrl(input);
    const productUrl = url || `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    const productName = name || input.trim();

    onSubmit({
      productName,
      productUrl,
      mode,
    });
  };

  const canSubmitFast = canPerformFree || isAuthenticated;
  const canSubmitDeep = isAuthenticated && hasPremium;
  const canSubmit = mode === 'fast' ? canSubmitFast : canSubmitDeep;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 backdrop-blur-sm mb-6"
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
          Google for <span className="text-primary">Safe Shopping</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Paste any product link. We'll tell you if it's legit — instantly.
        </p>
      </motion.div>

      {/* Smart Search Bar */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div
          className={cn(
            "relative rounded-3xl bg-card border-2 transition-all duration-300 shadow-premium-xl",
            isFocused
              ? "border-primary shadow-glow-lg"
              : "border-border/50 hover:border-primary/30"
          )}
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-primary/5 rounded-[1.75rem] blur-xl opacity-0 transition-opacity duration-300" 
            style={{ opacity: isFocused ? 0.6 : 0 }} />
          
          <div className="relative flex items-center gap-2 p-2 md:p-3">
            <div className="flex-shrink-0 pl-3 md:pl-4">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder={placeholders[placeholderIndex]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-foreground text-base md:text-lg placeholder:text-muted-foreground/50 py-3 md:py-4 px-2"
            />
            <Button
              type="submit"
              disabled={isLoading || !canSubmit || !input.trim()}
              className={cn(
                "h-12 md:h-14 px-6 md:px-8 rounded-2xl text-base font-semibold transition-all duration-300",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "shadow-lg hover:shadow-xl hover:shadow-primary/20",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Mode Switcher & Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
      >
        {/* Mode Toggle */}
        <div className="flex items-center bg-secondary/50 rounded-2xl p-1 border border-border/50">
          <button
            type="button"
            onClick={() => setMode('fast')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              mode === 'fast'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            Quick Scan
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) return;
              if (!hasPremium) {
                onUpgradeClick?.();
                return;
              }
              setMode('deep');
            }}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all relative",
              mode === 'deep'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              !isAuthenticated && "opacity-50 cursor-not-allowed"
            )}
          >
            <Crown className="w-3.5 h-3.5" />
            Deep Research
            {!hasPremium && (
              <Lock className="w-3 h-3 ml-0.5" />
            )}
          </button>
        </div>

        {/* Credits Info */}
        <AnimatePresence mode="wait">
          {!isAuthenticated && (
            <motion.span
              key="guest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              {remainingScans > 0 ? (
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  {remainingScans} free scan{remainingScans !== 1 ? 's' : ''} left
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-mixed">
                  <Lock className="w-3.5 h-3.5" />
                  Sign up to continue
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

SmartScanner.displayName = 'SmartScanner';
