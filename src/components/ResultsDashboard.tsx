import { useState } from 'react';
import { AnalysisResult } from '@/types/analysis';
import { TrustGauge } from './TrustGauge';
import { BreakdownBar } from './BreakdownBar';
import { CommunityQuote } from './CommunityQuote';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onBack: () => void;
}

export function ResultsDashboard({ result, onBack }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const isPremium = result.mode === 'deep';

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold truncate">{result.productName}</h2>
          {result.brand && (
            <p className="text-sm text-muted-foreground">{result.brand}</p>
          )}
        </div>
        <a
          href={result.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Mobile: Tabs */}
      <div className="md:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1">Analysis</TabsTrigger>
            {isPremium && (
              <TabsTrigger value="community" className="flex-1">Community</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewSection result={result} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <AnalysisSection result={result} />
          </TabsContent>

          {isPremium && (
            <TabsContent value="community" className="space-y-6">
              <CommunitySection result={result} />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <OverviewSection result={result} />
          </div>
          {isPremium && result.riskFactors && result.riskFactors.length > 0 && (
            <div className="bg-card rounded-2xl p-6 card-shadow">
              <RiskSection riskFactors={result.riskFactors} />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <AnalysisSection result={result} />
          </div>
          {isPremium && (
            <div className="bg-card rounded-2xl p-6 card-shadow">
              <CommunitySection result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewSection({ result }: { result: AnalysisResult }) {
  return (
    <div className="text-center space-y-6">
      <TrustGauge score={result.trustScore} status={result.status} size="lg" />
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold">Verdict</h3>
        <p className="text-muted-foreground">{result.verdict}</p>
      </div>
      <div className="text-xs text-muted-foreground">
        Analyzed {new Date(result.analyzedAt).toLocaleDateString()} ·{' '}
        <span className="capitalize">{result.mode} Scan</span>
      </div>
    </div>
  );
}

function AnalysisSection({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-lg font-semibold">Signal Breakdown</h3>
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
  );
}

function CommunitySection({ result }: { result: AnalysisResult }) {
  if (!result.communitySignals || result.communitySignals.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>No community signals available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold">Community Signals</h3>
      {result.communitySignals.map((signal, index) => (
        <CommunityQuote key={index} signal={signal} delay={index * 100} />
      ))}
    </div>
  );
}

function RiskSection({ riskFactors }: { riskFactors: string[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-mixed" />
        <h3 className="font-display text-lg font-semibold">Risk Factors</h3>
      </div>
      <ul className="space-y-2">
        {riskFactors.map((risk, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-muted-foreground animate-slide-in opacity-0"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mixed mt-2 flex-shrink-0" />
            {risk}
          </li>
        ))}
      </ul>
    </div>
  );
}
