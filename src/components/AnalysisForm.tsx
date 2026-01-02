import { useState } from 'react';
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
    <div className="bg-card rounded-2xl overflow-hidden card-shadow-lg">
      {/* Dark Header */}
      <div className="bg-gradient-to-br from-[hsl(215,25%,15%)] via-[hsl(215,25%,20%)] to-[hsl(152,30%,25%)] p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          The Product Reality Check
        </h2>
        <p className="text-white/70 text-sm">
          We ignore official reviews and analyze real community discussions.
        </p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Product Name & Brand Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-foreground font-medium">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              placeholder="e.g. SonicTooth Pro"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={isLoading}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand" className="text-foreground font-medium">
              Brand (Optional)
            </Label>
            <Input
              id="brand"
              placeholder="e.g. OralTech"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={isLoading}
              className="bg-background border-border"
            />
          </div>
        </div>

        {/* Product URL */}
        <div className="space-y-2">
          <Label htmlFor="productUrl" className="text-foreground font-medium">
            Product URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="productUrl"
            type="url"
            placeholder="https://amazon.com/..."
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            disabled={isLoading}
            required
            className="bg-background border-border"
          />
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <Label className="text-foreground font-medium">Analysis Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('fast')}
              disabled={isLoading}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200 text-center',
                mode === 'fast'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 bg-background'
              )}
            >
              <div className="flex justify-center mb-2">
                <Zap className={cn(
                  'w-6 h-6',
                  mode === 'fast' ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <span className={cn(
                'font-semibold text-sm',
                mode === 'fast' ? 'text-primary' : 'text-foreground'
              )}>
                Fast Scan
              </span>
              <p className={cn(
                'text-xs mt-1',
                mode === 'fast' ? 'text-primary/70' : 'text-muted-foreground'
              )}>
                Instant check
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('deep')}
              disabled={isLoading || !isAuthenticated}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200 text-center relative',
                mode === 'deep'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 bg-background',
                !isAuthenticated && 'opacity-60 cursor-not-allowed'
              )}
            >
              {!hasPremium && (
                <div className="absolute -top-2 -right-2">
                  <Crown className="w-5 h-5 text-mixed" />
                </div>
              )}
              <div className="flex justify-center mb-2">
                <Search className={cn(
                  'w-6 h-6',
                  mode === 'deep' ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <span className={cn(
                'font-semibold text-sm',
                mode === 'deep' ? 'text-primary' : 'text-foreground'
              )}>
                Deep Research
              </span>
              <p className={cn(
                'text-xs mt-1',
                mode === 'deep' ? 'text-primary/70' : 'text-muted-foreground'
              )}>
                Full analysis
              </p>
            </button>
          </div>
        </div>

        {/* Usage Info */}
        {!isAuthenticated && mode === 'fast' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Zap className="w-4 h-4" />
            <span>
              {remainingScans} free scan{remainingScans !== 1 ? 's' : ''} remaining today
            </span>
          </div>
        )}

        {!canPerformFree && !isAuthenticated && mode === 'fast' && (
          <div className="flex items-center gap-2 text-sm text-mixed bg-mixed/10 p-3 rounded-lg">
            <Lock className="w-4 h-4" />
            <span>You've reached the free scan limit. Sign in to continue.</span>
          </div>
        )}

        {mode === 'deep' && !isAuthenticated && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Lock className="w-4 h-4" />
            <span>Sign in to access Deep Research</span>
          </div>
        )}

        {mode === 'deep' && isAuthenticated && !hasPremium && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full flex items-center justify-between text-sm text-mixed bg-mixed/10 p-3 rounded-lg hover:bg-mixed/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span>Upgrade to Premium for Deep Research</span>
            </div>
            <span className="text-xs font-medium">$9.99/mo →</span>
          </button>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={isLoading || !canSubmit}
        >
          {isLoading ? (
            'Analyzing...'
          ) : (
            <>
              <Search className="w-5 h-5" />
              Reveal Product Truth
            </>
          )}
        </Button>

        {/* Powered By */}
        <p className="text-center text-xs text-muted-foreground">
          Powered by Gemini 2.5 Flash Lite & Gemini 3 Pro
        </p>
      </form>
    </div>
  );
}