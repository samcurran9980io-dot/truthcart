import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareReportProps {
  reportId: string;
  productName: string;
  trustScore: number;
}

export function ShareReport({ reportId, productName, trustScore }: ShareReportProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const reportUrl = `${window.location.origin}/report/${reportId}`;
  const shareText = `I just ran a TruthCart scan on "${productName}". It scored ${trustScore}/100. See the full breakdown here:`;

  const copyLink = () => {
    navigator.clipboard.writeText(reportUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(reportUrl)}`,
      '_blank'
    );
  };

  const shareToReddit = () => {
    window.open(
      `https://reddit.com/submit?url=${encodeURIComponent(reportUrl)}&title=${encodeURIComponent(`TruthCart Analysis: ${productName} scored ${trustScore}/100`)}`,
      '_blank'
    );
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} ${reportUrl}`)}`,
      '_blank'
    );
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl gap-2"
        onClick={() => setOpen(!open)}
      >
        <Share2 className="w-4 h-4" />
        Share Report
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-72 bg-card border border-border/50 rounded-2xl shadow-premium-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Share this Report</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Copy Link */}
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left mb-2"
            >
              {copied ? <Check className="w-4 h-4 text-trusted" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              <span className="text-sm text-foreground">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <div className="h-px bg-border/50 my-2" />

            {/* Social Buttons */}
            <div className="space-y-1">
              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
              >
                <span className="text-base">𝕏</span>
                <span className="text-sm text-foreground">Share on X (Twitter)</span>
              </button>
              <button
                onClick={shareToReddit}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
              >
                <span className="text-base">🟠</span>
                <span className="text-sm text-foreground">Share on Reddit</span>
              </button>
              <button
                onClick={shareToWhatsApp}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left"
              >
                <span className="text-base">💬</span>
                <span className="text-sm text-foreground">Share on WhatsApp</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
