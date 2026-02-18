import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrustGauge } from '@/components/TrustGauge';
import { AnalysisResult } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface CompareViewProps {
  items: AnalysisResult[];
  onBack: () => void;
}

export function CompareView({ items, onBack }: CompareViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Compare Products</h2>
        <Badge variant="secondary">{items.length} products</Badge>
      </div>

      <div className={cn(
        "grid gap-6",
        items.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
      )}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-3xl border border-border/50 shadow-premium overflow-hidden"
          >
            {/* Header */}
            <div className={cn(
              "p-6 text-center",
              item.status === 'trusted' && "bg-trusted/5",
              item.status === 'mixed' && "bg-mixed/5",
              item.status === 'suspicious' && "bg-suspicious/5",
            )}>
              <TrustGauge score={item.trustScore} status={item.status} size="sm" />
              <h3 className="font-semibold text-foreground mt-3 text-sm line-clamp-2">
                {item.productName}
              </h3>
              <Badge
                className={cn(
                  "mt-2",
                  item.status === 'trusted' && "bg-trusted/10 text-trusted border-trusted/20",
                  item.status === 'mixed' && "bg-mixed/10 text-mixed border-mixed/20",
                  item.status === 'suspicious' && "bg-suspicious/10 text-suspicious border-suspicious/20",
                )}
                variant="outline"
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>

            {/* Breakdown */}
            <div className="p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Score Breakdown
              </h4>
              {item.breakdown.map((b) => (
                <div key={b.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{b.label}</span>
                  <span className={cn(
                    "font-semibold",
                    b.score >= 70 ? "text-trusted" : b.score >= 40 ? "text-mixed" : "text-suspicious"
                  )}>
                    {b.score}
                  </span>
                </div>
              ))}

              {/* Risk Factors */}
              {item.riskFactors && item.riskFactors.length > 0 && (
                <div className="pt-3 border-t border-border/50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Risk Factors
                  </h4>
                  <ul className="space-y-1">
                    {item.riskFactors.slice(0, 3).map((risk, i) => (
                      <li key={i} className="text-xs text-suspicious flex items-start gap-1.5">
                        <span className="mt-1">⚠️</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Verdict */}
            <div className="px-5 pb-5">
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground line-clamp-3">{item.verdict}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
