import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getUserPlan } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { type UserPlan } from '@/lib/plans';

export default function Privacy() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan>(getUserPlan());

  useEffect(() => {
    setUserPlan(getUserPlan());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={signOut}
        userPlan={userPlan}
      />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to TruthCart. We respect your privacy and are committed to protecting your personal data. This policy explains how we handle your information when you use our web application.
            </p>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect minimal data necessary to provide our AI analysis services:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Input Data:</span>
                  <span>The product URLs, names, and review text you submit for analysis.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Usage Data:</span>
                  <span>We track how many scans you perform to manage your free/paid credits.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Account Information:</span>
                  <span>If you sign up, we store your email address and authentication details via our secure provider.</span>
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Data</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">To Provide Services:</span>
                  <span>We process the product data you send to generate Trust Scores and Verdicts.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">AI Processing:</span>
                  <span>Product text is sent to our AI provider (OpenAI) for analysis. This data is not used to train public AI models.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Improvement:</span>
                  <span>We analyze usage patterns to improve the accuracy of our scam detection.</span>
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Third-Party Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal data. We share data only with essential service providers:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">OpenAI:</span>
                  <span>For generating the AI analysis.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Lovable & Render:</span>
                  <span>For hosting our website and backend server.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Payment Processors:</span>
                  <span>If you upgrade to a premium plan, payments are handled securely by third-party providers (e.g., Stripe). We do not store credit card details.</span>
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Affiliate Disclosure</h2>
              <p className="text-muted-foreground">
                TruthCart is a participant in the Amazon Services LLC Associates Program. When you click "Buy Trusted" or other product links on our site, we may earn a small affiliate commission at no extra cost to you. This helps support the project.
              </p>
            </section>

            <div className="text-center pt-8 text-sm text-muted-foreground">
              <p>Last updated: January 2025</p>
              <p className="mt-2">
                Questions? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
