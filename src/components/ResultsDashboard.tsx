import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '@/types/analysis';
import { TrustGauge } from './TrustGauge';
import { BreakdownBar } from './BreakdownBar';
import { CommunityQuote } from './CommunityQuote';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle, Sparkles, ThumbsUp, ThumbsDown, Database, Link2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onBack: () => void;
}

export function ResultsDashboard({ result, onBack }: ResultsDashboardProps) {
  const isPremium = result.mode === 'deep';
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const statusBadge = {
    trusted: { label: 'TRUSTED', bgClass: 'bg-trusted/10', textClass: 'text-trusted', borderClass: 'border-trusted/30' },
    mixed: { label: 'MIXED', bgClass: 'bg-mixed/10', textClass: 'text-mixed', borderClass: 'border-mixed/30' },
    suspicious: { label: 'SUSPICIOUS', bgClass: 'bg-suspicious/10', textClass: 'text-suspicious', borderClass: 'border-suspicious/30' },
  };

  const badge = statusBadge[result.status];
  const confidenceLabel = result.confidence === 'high' ? 'High Confidence' : result.confidence === 'medium' ? 'Medium Confidence' : 'Low Confidence';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      {/* Back Button */}
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        whileHover={{ x: -4 }}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Analyze another product</span>
      </motion.button>

      {/* Hero Section - Trust Score */}
      <motion.div 
        variants={itemVariants}
        className="bg-card rounded-3xl p-8 md:p-10 shadow-premium-xl border border-border/50 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* Product Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border',
                  badge.bgClass, badge.textClass, badge.borderClass
                )}
              >
                {badge.label}
              </motion.span>
              {isPremium && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase tracking-wide">
                  Deep Research
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{result.productName}</h1>
            
            {result.brand && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>{result.brand}</span>
                <span>·</span>
                <a
                  href={result.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  View Product <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Verdict */}
            <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary rounded-r-xl p-4 mt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">VERDICT</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.verdict}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Score Gauge */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Trust Score
            </span>
            <TrustGauge score={result.trustScore} status={result.status} size="lg" />
            <span className="text-xs text-muted-foreground">{confidenceLabel}</span>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Score Breakdown */}
          <motion.div 
            variants={itemVariants}
            className="bg-card rounded-3xl p-6 md:p-8 shadow-premium border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Score Breakdown</h3>
            </div>
            <div className="space-y-5">
              {result.breakdown.map((item, index) => (
                <BreakdownBar
                  key={item.label}
                  label={item.label}
                  score={item.score}
                  description={item.description}
                  delay={index * 100}
                />
              ))}
            </div>
          </motion.div>

          {/* Detected Reality Gaps */}
          {isPremium && result.riskFactors && result.riskFactors.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="bg-card rounded-3xl p-6 md:p-8 shadow-premium border border-border/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-mixed/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-mixed" />
                </div>
                <h3 className="text-lg font-semibold">Reality Gaps</h3>
              </div>
              <div className="space-y-3">
                {result.riskFactors.map((risk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-suspicious/5 border border-suspicious/10 rounded-2xl"
                  >
                    <span className="text-suspicious font-bold">✕</span>
                    <span className="text-sm text-foreground">{risk}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Voice of Customer */}
          {isPremium && result.communitySignals && result.communitySignals.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="bg-card rounded-3xl p-6 md:p-8 shadow-premium border border-border/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Community Voice</h3>
              </div>
              
              {/* Main Issue */}
              <div className="mb-5 p-4 bg-secondary/50 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <AlertTriangle className="w-3 h-3" />
                  MAIN CONCERN
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {result.communitySignals[0]?.quote || 'Community feedback analysis in progress.'}
                </p>
              </div>

              {/* Community Quotes */}
              <div className="space-y-3">
                {result.communitySignals.slice(0, 3).map((signal, index) => (
                  <CommunityQuote key={index} signal={signal} delay={index * 100} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Data Sources */}
          <motion.div 
            variants={itemVariants}
            className="bg-card rounded-3xl p-6 md:p-8 shadow-premium border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Database className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Data Sources</h3>
            </div>
            
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-trusted animate-pulse" />
              <span className="text-sm font-medium text-foreground">Live Community Data</span>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Link2 className="w-3 h-3" />
                <span className="font-semibold uppercase tracking-wide">Sources</span>
              </div>
              
              {result.dataSources && result.dataSources.length > 0 ? (
                result.dataSources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline truncate p-2 rounded-lg hover:bg-primary/5 transition-colors"
                    title={source.url}
                  >
                    {source.url.length > 45 ? source.url.slice(0, 45) + '...' : source.url}
                  </a>
                ))
              ) : (
                <>
                  <a
                    href={`https://www.reddit.com/search/?q=${encodeURIComponent(result.productName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline p-2 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    reddit.com/search/{result.productName}
                  </a>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(result.productName + ' review')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline p-2 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    youtube.com/search/{result.productName}+review
                  </a>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm pt-4 border-t border-border">
              <CheckCircle className="w-4 h-4 text-trusted" />
              <span className="text-muted-foreground">{confidenceLabel}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feedback Section */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 bg-card rounded-3xl p-8 shadow-premium border border-border/50 text-center"
      >
        <p className="text-sm text-muted-foreground mb-5">Was this analysis helpful?</p>
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={() => setFeedbackGiven('up')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'w-12 h-12 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center',
              feedbackGiven === 'up'
                ? 'bg-trusted text-background border-trusted shadow-lg shadow-trusted/20'
                : 'border-border text-muted-foreground hover:border-trusted hover:text-trusted'
            )}
          >
            <ThumbsUp className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => setFeedbackGiven('down')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'w-12 h-12 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center',
              feedbackGiven === 'down'
                ? 'bg-suspicious text-background border-suspicious shadow-lg shadow-suspicious/20'
                : 'border-border text-muted-foreground hover:border-suspicious hover:text-suspicious'
            )}
          >
            <ThumbsDown className="w-5 h-5" />
          </motion.button>
        </div>
        {feedbackGiven && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground mt-4"
          >
            Thanks for your feedback!
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
