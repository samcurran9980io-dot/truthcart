import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PLANS, CREDIT_COSTS, type BillingCycle, type PlanId } from '@/lib/plans';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getPriceId, type StripePlanId } from '@/lib/stripe';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === 'free') {
      navigate('/');
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem('truthcart_selected_plan', JSON.stringify({ planId, billingCycle }));
      navigate('/auth?upgrade=true');
      return;
    }

    setLoadingPlan(planId);

    try {
      const priceId = getPriceId(planId as StripePlanId, billingCycle);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: 'Unable to start checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">TruthCart</span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="rounded-xl">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-none">
              Simple, Transparent Pricing
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
          >
            Choose Your Plan
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            One credit system. Zero complexity. Use credits for Quick Scans or Deep Research.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <span className={cn(
              "text-sm font-medium transition-colors",
              billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
            )}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              className="data-[state=checked]:bg-primary"
            />
            <span className={cn(
              "text-sm font-medium transition-colors",
              billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'
            )}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-trusted/10 text-trusted border-trusted/20 hover:bg-trusted/20">
                Save up to 35%
              </Badge>
            )}
          </motion.div>

          {/* Credit Explainer */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-6 bg-secondary/50 rounded-2xl px-6 py-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Quick Scan = {CREDIT_COSTS.quickScan} credit</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Deep Research = {CREDIT_COSTS.deepResearch} credits</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-20"
        >
          {PLANS.map((plan, index) => {
            const price = billingCycle === 'yearly' ? plan.yearlyMonthlyEquivalent : plan.monthlyPrice;
            const isHighlighted = plan.highlighted;

            return (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={cn(
                  "relative flex flex-col rounded-3xl p-6 md:p-8 transition-all duration-300",
                  isHighlighted
                    ? "bg-foreground text-background shadow-2xl shadow-foreground/20 scale-[1.02] md:scale-105 z-10"
                    : "bg-card border border-border/50 shadow-premium hover:shadow-premium-lg"
                )}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge 
                      className={cn(
                        "px-4 py-1 text-xs font-semibold",
                        isHighlighted 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className={cn(
                    "text-xl font-bold mb-1",
                    isHighlighted ? "text-background" : "text-foreground"
                  )}>
                    {plan.name}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    isHighlighted ? "text-background/70" : "text-muted-foreground"
                  )}>
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-4xl font-bold",
                      isHighlighted ? "text-background" : "text-foreground"
                    )}>
                      {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
                    </span>
                    {price > 0 && (
                      <span className={cn(
                        "text-sm",
                        isHighlighted ? "text-background/60" : "text-muted-foreground"
                      )}>
                        /month
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.yearlySavings > 0 && (
                    <p className={cn(
                      "text-sm mt-1 font-medium",
                      isHighlighted ? "text-primary" : "text-trusted"
                    )}>
                      Save ${plan.yearlySavings}/year
                    </p>
                  )}
                  {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                    <p className={cn(
                      "text-xs mt-0.5",
                      isHighlighted ? "text-background/50" : "text-muted-foreground"
                    )}>
                      Billed ${plan.yearlyPrice}/year
                    </p>
                  )}
                </div>

                {/* Credits */}
                {plan.credits > 0 && (
                  <div className={cn(
                    "rounded-2xl px-4 py-4 mb-6",
                    isHighlighted ? "bg-background/10" : "bg-secondary/50"
                  )}>
                    <p className={cn(
                      "font-bold text-lg",
                      isHighlighted ? "text-background" : "text-foreground"
                    )}>
                      {plan.credits} credits{plan.id !== 'free' && '/month'}
                    </p>
                    <p className={cn(
                      "text-xs mt-0.5",
                      isHighlighted ? "text-background/60" : "text-muted-foreground"
                    )}>
                      {plan.id === 'free' 
                        ? "That's 10 product checks"
                        : `Up to ${plan.credits} products/month`}
                    </p>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        isHighlighted ? "text-primary" : "text-primary"
                      )} />
                      <span className={cn(
                        "text-sm",
                        isHighlighted ? "text-background/90" : "text-foreground"
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className={cn(
                      "w-full h-12 rounded-2xl font-semibold",
                      isHighlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                        : plan.id === 'free'
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      plan.id === 'free' ? 'Get Started' : 'Subscribe Now'
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Usage Examples */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-bold text-center mb-10"
          >
            How Credits Work
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div 
              variants={itemVariants}
              className="bg-card rounded-3xl p-6 border border-border/50 shadow-premium"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Scan</h3>
                  <p className="text-sm text-muted-foreground">{CREDIT_COSTS.quickScan} credit</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Fast, surface-level analysis. Perfect for everyday purchases.
              </p>
              <div className="text-sm p-3 bg-secondary/50 rounded-xl">
                <p className="font-medium text-foreground">Basic (200 credits):</p>
                <p className="text-muted-foreground">→ Check 200 products/month</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-card rounded-3xl p-6 border border-border/50 shadow-premium"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Deep Research</h3>
                  <p className="text-sm text-muted-foreground">{CREDIT_COSTS.deepResearch} credits</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive analysis with patterns, risks, and community insights.
              </p>
              <div className="text-sm p-3 bg-secondary/50 rounded-xl">
                <p className="font-medium text-foreground">Pro (600 credits):</p>
                <p className="text-muted-foreground">→ 200 Deep Research/month</p>
              </div>
            </motion.div>
          </div>

          <motion.p 
            variants={itemVariants}
            className="text-center text-muted-foreground mt-10"
          >
            Credits reset monthly. No rollover.
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 TruthCart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
