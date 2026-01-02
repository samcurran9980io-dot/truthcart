import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnalysisInput, AnalysisMode } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Zap, Search, Lock, Crown } from 'lucide-react';

interface AnalysisFormProps {
  onSubmit: (input: AnalysisInput) => void;
  isLoading: boolean;
  remainingScans: number;
  canPerformFree: boolean;
  isAuthenticated: boolean;
  hasPremium: boolean;
}

export function AnalysisForm({
  onSubmit,
  isLoading,
  remainingScans,
  canPerformFree,
  isAuthenticated,
  hasPremium,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name *</Label>
          <Input
            id="productName"
            placeholder="e.g., Sony WH-1000XM5"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand (optional)</Label>
          <Input
            id="brand"
            placeholder="e.g., Sony"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productUrl">Product URL *</Label>
          <Input
            id="productUrl"
            type="url"
            placeholder="https://amazon.com/..."
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <Label>Analysis Mode</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('fast')}
            disabled={isLoading}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-200 text-left',
              mode === 'fast'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold">Fast Scan</span>
            </div>
            <p className="text-xs text-muted-foreground">Quick trust assessment</p>
            <p className="text-xs font-medium text-primary mt-1">Free</p>
          </button>

          <button
            type="button"
            onClick={() => setMode('deep')}
            disabled={isLoading || (!isAuthenticated)}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-200 text-left relative',
              mode === 'deep'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50',
              !isAuthenticated && 'opacity-60 cursor-not-allowed'
            )}
          >
            {!hasPremium && (
              <div className="absolute -top-2 -right-2">
                <Crown className="w-5 h-5 text-mixed" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-primary" />
              <span className="font-semibold">Deep Research</span>
            </div>
            <p className="text-xs text-muted-foreground">In-depth community analysis</p>
            <p className="text-xs font-medium text-mixed mt-1">Premium</p>
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
        <div className="flex items-center gap-2 text-sm text-mixed bg-mixed/10 p-3 rounded-lg">
          <Crown className="w-4 h-4" />
          <span>Upgrade to Premium for Deep Research</span>
        </div>
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
        ) : mode === 'fast' ? (
          <>
            <Zap className="w-5 h-5" />
            Start Fast Scan
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Start Deep Research
          </>
        )}
      </Button>
    </form>
  );
}
