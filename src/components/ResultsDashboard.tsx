import { useState } from 'react';
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
    trusted: { label: 'TRUSTED', bgClass: 'bg-trusted/10', textClass: 'text-trusted', borderClass: 'border-trusted' },
    mixed: { label: 'MIXED', bgClass: 'bg-mixed/10', textClass: 'text-mixed', borderClass: 'border-mixed' },
    suspicious: { label: 'SUSPICIOUS', bgClass: 'bg-suspicious/10', textClass: 'text-suspicious', borderClass: 'border-suspicious' },
  };

  const badge = statusBadge[result.status];

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Analyze another product</span>
      </button>

      {/* Main Card */}
      <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow-lg mb-6">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-xl md:text-2xl font-bold">{result.productName}</h1>
              <span className={cn(
                'px-2 py-0.5 rounded text-xs font-bold uppercase border',
                badge.bgClass, badge.textClass, badge.borderClass
              )}>
                {badge.label}
              </span>
            </div>
            {result.brand && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
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
            <p className="text-xs text-muted-foreground">
              Analyzed {new Date(result.analyzedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Trust Score */}
          <div className="flex items-center gap-4">
            <TrustGauge score={result.trustScore} status={result.status} size="md" />
          </div>
        </div>

        {/* Verdict Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">VERDICT</h3>
              <p className="text-sm text-muted-foreground">{result.verdict}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Score Breakdown */}
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Score Breakdown</h3>
            </div>
            <div className="space-y-4">
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
          </div>

          {/* Detected Reality Gaps */}
          {isPremium && result.riskFactors && result.riskFactors.length > 0 && (
            <div className="bg-card rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-mixed" />
                <h3 className="font-display text-lg font-semibold">Detected Reality Gaps</h3>
              </div>
              <div className="space-y-2">
                {result.riskFactors.map((risk, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-suspicious/5 border border-suspicious/20 rounded-lg animate-slide-in opacity-0"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <span className="text-suspicious text-lg">✕</span>
                    <span className="text-sm text-foreground">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Analysis Summary (Premium) */}
          {isPremium && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Analysis Summary
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.verdict}
              </p>
            </div>
          )}

          {/* Voice of Customer */}
          {isPremium && result.communitySignals && result.communitySignals.length > 0 && (
            <div className="bg-card rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Voice of Customer</h3>
              </div>
              
              {/* Main Issue */}
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  MAIN ISSUE
                </div>
                <p className="text-sm text-foreground">
                  {result.communitySignals[0]?.quote || 'Community feedback analysis in progress.'}
                </p>
              </div>

              {/* Community Quotes */}
              <div className="space-y-3">
                {result.communitySignals.slice(0, 3).map((signal, index) => (
                  <CommunityQuote key={index} signal={signal} delay={index * 100} />
                ))}
              </div>
            </div>
          )}

          {/* Data Sources */}
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-display text-lg font-semibold">Data Sources</h3>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-trusted animate-pulse" />
              <span className="text-foreground">Live Community Data</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link2 className="w-3 h-3" />
                <span className="font-medium uppercase">Sources</span>
              </div>
              <div className="text-xs text-primary truncate">
                https://reddit.com/r/products/...
              </div>
              <div className="text-xs text-primary truncate">
                https://youtube.com/watch?v=...
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-trusted" />
              <span className="text-muted-foreground">High Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-8 bg-card rounded-2xl p-6 card-shadow text-center">
        <p className="text-sm text-muted-foreground mb-4">Was this analysis helpful?</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setFeedbackGiven('up')}
            className={cn(
              'w-10 h-10 rounded-full border transition-all duration-200 flex items-center justify-center',
              feedbackGiven === 'up'
                ? 'bg-trusted text-white border-trusted'
                : 'border-border text-muted-foreground hover:border-trusted hover:text-trusted'
            )}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFeedbackGiven('down')}
            className={cn(
              'w-10 h-10 rounded-full border transition-all duration-200 flex items-center justify-center',
              feedbackGiven === 'down'
                ? 'bg-suspicious text-white border-suspicious'
                : 'border-border text-muted-foreground hover:border-suspicious hover:text-suspicious'
            )}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}