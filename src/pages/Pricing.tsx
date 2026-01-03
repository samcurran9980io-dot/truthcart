import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PLANS, CREDIT_COSTS, formatPrice, type BillingCycle, type PlanId } from '@/lib/plans';
import { cn } from '@/lib/utils';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const navigate = useNavigate();

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === 'free') {
      navigate('/');
    } else {
      // Store selected plan and redirect to auth/payment
      localStorage.setItem('truthcart_selected_plan', JSON.stringify({ planId, billingCycle }));
      navigate('/auth?upgrade=true');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">TruthCart</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4 px-3 py-1">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            One credit system. Zero complexity. 
            <br className="hidden sm:block" />
            Use credits for Quick Scans or Deep Research — your choice.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
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
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                Save up to 35%
              </Badge>
            )}
          </div>

          {/* Credit Explainer */}
          <div className="inline-flex items-center gap-6 bg-muted/50 rounded-full px-6 py-3 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Quick Scan = {CREDIT_COSTS.quickScan} credit</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <span>Deep Research = {CREDIT_COSTS.deepResearch} credits</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {PLANS.map((plan, index) => {
            const price = billingCycle === 'yearly' ? plan.yearlyMonthlyEquivalent : plan.monthlyPrice;
            const isHighlighted = plan.highlighted;

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl p-6 md:p-8 transition-all duration-300",
                  isHighlighted
                    ? "bg-primary text-primary-foreground scale-[1.02] md:scale-105 shadow-xl glow"
                    : "bg-card border border-border card-shadow hover:shadow-lg"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge */}
                {plan.badge && (
                  <Badge 
                    className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 px-3",
                      isHighlighted 
                        ? "bg-background text-foreground" 
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {plan.badge}
                  </Badge>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className={cn(
                    "text-xl font-bold mb-1",
                    isHighlighted ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {plan.name}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-4xl font-bold",
                      isHighlighted ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
                    </span>
                    {price > 0 && (
                      <span className={cn(
                        "text-sm",
                        isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        /month
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.yearlySavings > 0 && (
                    <p className={cn(
                      "text-sm mt-1",
                      isHighlighted ? "text-primary-foreground/80" : "text-primary"
                    )}>
                      Save ${plan.yearlySavings}/year
                    </p>
                  )}
                  {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                    <p className={cn(
                      "text-xs mt-0.5",
                      isHighlighted ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      Billed ${plan.yearlyPrice}/year
                    </p>
                  )}
                </div>

                {/* Credits */}
                {plan.credits > 0 && (
                  <div className={cn(
                    "rounded-lg px-4 py-3 mb-6",
                    isHighlighted ? "bg-primary-foreground/10" : "bg-muted"
                  )}>
                    <p className={cn(
                      "font-semibold",
                      isHighlighted ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {plan.credits} credits{plan.id !== 'free' && '/month'}
                    </p>
                    <p className={cn(
                      "text-xs mt-0.5",
                      isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {plan.id === 'free' 
                        ? "That's 10 product checks to start"
                        : `That's up to ${plan.credits} products/month`}
                    </p>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        isHighlighted ? "text-primary-foreground" : "text-primary"
                      )} />
                      <span className={cn(
                        "text-sm",
                        isHighlighted ? "text-primary-foreground/90" : "text-foreground"
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full",
                    isHighlighted
                      ? "bg-background text-primary hover:bg-background/90"
                      : plan.id === 'free'
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : ""
                  )}
                  variant={isHighlighted ? "secondary" : plan.id === 'free' ? "secondary" : "default"}
                  size="lg"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.id === 'free' ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Usage Examples */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How Credits Work</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Scan</h3>
                  <p className="text-sm text-muted-foreground">{CREDIT_COSTS.quickScan} credit each</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Fast, surface-level analysis. Perfect for everyday purchases like clothes, accessories, or household items.
              </p>
              <div className="text-sm">
                <p className="font-medium text-foreground">Example with Basic (200 credits):</p>
                <p className="text-muted-foreground">→ Check 200 products per month</p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Deep Research</h3>
                  <p className="text-sm text-muted-foreground">{CREDIT_COSTS.deepResearch} credits each</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive analysis with patterns, risks, and community deep-dive. Ideal for expensive or important purchases.
              </p>
              <div className="text-sm">
                <p className="font-medium text-foreground">Example with Pro (600 credits):</p>
                <p className="text-muted-foreground">→ 200 Deep Research scans per month</p>
              </div>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Have questions? Credits reset monthly and never roll over.
            </p>
            <p className="text-sm text-muted-foreground">
              Need more? <span className="text-primary font-medium">Contact us</span> for custom plans.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 TruthCart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
