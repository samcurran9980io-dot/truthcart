import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Check, CreditCard, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const features = [
  'Unlimited Deep Research scans',
  'Community sentiment analysis',
  'Reality Gap detection',
  'Risk factor identification',
  'Voice of Customer insights',
  'Priority processing',
];

export function PremiumUpgradeModal({ open, onOpenChange, onSuccess }: PremiumUpgradeModalProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store premium status
    localStorage.setItem('truthcart_premium', 'true');
    localStorage.setItem('truthcart_premium_date', new Date().toISOString());
    
    setStep('success');
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess();
    }
    onOpenChange(false);
    // Reset state after close
    setTimeout(() => setStep('info'), 300);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'info' && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl font-display">
                Upgrade to Premium
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Cancel anytime. No commitments.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-trusted/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-trusted" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button onClick={handleProceedToPayment} className="w-full" size="lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Continue to Payment
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-display">
                Payment Details
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handlePayment} className="py-4 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">TruthCart Premium</span>
                  <span className="font-bold">$9.99/mo</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" size="lg">
                  Pay $9.99
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                This is a demo. No real payment will be processed.
              </p>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Processing Payment</h3>
            <p className="text-sm text-muted-foreground">Please wait while we process your payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-trusted/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-trusted" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Welcome to Premium!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You now have access to Deep Research and all premium features.
            </p>
            <Button onClick={handleClose} className="w-full" size="lg">
              <Zap className="w-5 h-5 mr-2" />
              Start Deep Research
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}