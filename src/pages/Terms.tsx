import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getUserPlan } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { type UserPlan } from '@/lib/plans';

export default function Terms() {
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              By accessing or using TruthCart, you agree to be bound by these terms.
            </p>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Nature of Service (AI Disclaimer)</h2>
              <p className="text-muted-foreground mb-4">
                TruthCart uses Artificial Intelligence to analyze product reviews and detect potential scams.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">No Guarantees:</span>
                  <span>AI is not perfect. While we strive for accuracy, we cannot guarantee that a "Trusted" product is flawless or that a "Suspicious" product is definitely a scam.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">User Responsibility:</span>
                  <span>You are responsible for your own purchasing decisions. TruthCart is a research tool, not financial or legal advice. We are not liable for any purchases you make based on our analysis.</span>
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Usage & Credits</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Free Tier:</span>
                  <span>Users are provided with a limited number of free "Quick Scans" and "Deep Research" credits.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold">Fair Use:</span>
                  <span>You agree not to abuse the API, reverse-engineer the software, or use automated bots to scrape our service. We reserve the right to ban users who abuse the system.</span>
                </li>
              </ul>
            </section>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The TruthCart name, logo, and analysis algorithms are the intellectual property of TruthCart. You may not copy or reproduce our branding without permission.
              </p>
            </section>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, TruthCart shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the service.
              </p>
            </section>

            <section className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms or our Privacy Policy, please{' '}
                <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
              </p>
            </section>

            <div className="text-center pt-8 text-sm text-muted-foreground">
              <p>Last updated: January 2025</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
