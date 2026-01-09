import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Chrome, 
  Zap, 
  Eye, 
  Bell, 
  BarChart3, 
  Lock, 
  Download,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Eye,
    title: 'Instant Trust Overlay',
    description: 'See trust scores directly on Amazon, eBay, and Flipkart product pages without leaving the site.',
    premium: false,
  },
  {
    icon: Zap,
    title: 'One-Click Analysis',
    description: 'Analyze any product with a single click. No copy-pasting URLs needed.',
    premium: false,
  },
  {
    icon: Bell,
    title: 'Price Drop Alerts',
    description: 'Get notified when tracked products drop in price or have new reviews.',
    premium: true,
  },
  {
    icon: BarChart3,
    title: 'Review Trend Charts',
    description: 'Visualize review sentiment over time to spot manipulation patterns.',
    premium: true,
  },
  {
    icon: Lock,
    title: 'Competitor Comparison',
    description: 'Compare similar products side-by-side with trust scores and pricing.',
    premium: true,
  },
  {
    icon: Download,
    title: 'Export Reports',
    description: 'Download detailed PDF reports of your analysis for later reference.',
    premium: true,
  },
];

const platforms = [
  { name: 'Amazon', color: 'bg-orange-500' },
  { name: 'eBay', color: 'bg-blue-500' },
  { name: 'Flipkart', color: 'bg-yellow-500' },
  { name: 'Walmart', color: 'bg-blue-600' },
];

export default function Extension() {
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
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Chrome className="w-12 h-12 text-primary" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-trusted flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-none">
              Chrome Extension
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
          >
            Shop Smarter,{' '}
            <span className="text-primary">Directly</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Get instant trust scores and scam detection right on product pages. 
            No more switching tabs—TruthCart works where you shop.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button size="lg" className="rounded-2xl h-14 px-8 text-lg gap-3">
              <Chrome className="w-5 h-5" />
              Add to Chrome — It's Free
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 text-lg" asChild>
              <Link to="/pricing">View Pro Features</Link>
            </Button>
          </motion.div>

          {/* Platform Support */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
            <span className="text-sm text-muted-foreground mr-2">Works on:</span>
            {platforms.map((platform) => (
              <Badge key={platform.name} variant="secondary" className="px-3 py-1">
                <div className={cn('w-2 h-2 rounded-full mr-2', platform.color)} />
                {platform.name}
              </Badge>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            Everything You Need to Shop Safe
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={cn(
                  "relative bg-card rounded-3xl p-6 border border-border/50 shadow-premium transition-all duration-300",
                  feature.premium && "border-primary/30"
                )}
              >
                {feature.premium && (
                  <Badge className="absolute -top-2 right-4 bg-primary text-primary-foreground text-[10px] px-2">
                    PRO
                  </Badge>
                )}
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                  feature.premium ? "bg-primary/10" : "bg-secondary"
                )}>
                  <feature.icon className={cn(
                    "w-6 h-6",
                    feature.premium ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Install Extension', desc: 'Add TruthCart to Chrome in one click' },
              { step: '2', title: 'Browse Products', desc: 'Shop on Amazon, eBay, or any supported site' },
              { step: '3', title: 'See Trust Scores', desc: 'Instant overlays show product reliability' },
            ].map((item, index) => (
              <motion.div key={item.step} variants={itemVariants} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <motion.div variants={itemVariants} className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-primary text-primary" />
            ))}
          </motion.div>
          <motion.p variants={itemVariants} className="text-lg font-medium mb-2">
            "Finally, I can shop with confidence!"
          </motion.p>
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            — Rated 4.9/5 by 2,000+ users
          </motion.p>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/20"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Start Shopping Safely Today
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of smart shoppers who never get scammed.
            </p>
            <Button size="lg" className="rounded-2xl h-14 px-8 text-lg gap-3">
              <Chrome className="w-5 h-5" />
              Install Free Extension
            </Button>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-trusted" />
                Free forever
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-trusted" />
                No signup required
              </span>
            </div>
          </motion.div>
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
