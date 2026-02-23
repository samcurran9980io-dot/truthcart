import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Zap } from 'lucide-react';
import { ChromeLogo } from '@/components/ChromeLogo';

export const CHROME_EXTENSION_URL = 'https://chromewebstore.google.com/detail/truthcart-safe-shopping-s/jcabelfgniclfkknhjgdnibicgebacpo?authuser=0&hl=en';

export function ChromeExtensionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <a
        href={CHROME_EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-card rounded-3xl p-5 shadow-premium border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
      >
        {/* Subtle background shimmer */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />

        <div className="relative flex items-center gap-4">
          {/* Chrome logo */}
          <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-white shadow-md flex items-center justify-center ring-1 ring-border/50">
            <ChromeLogo className="w-6 h-6" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-sm text-foreground">Chrome Extension</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase">
                <Zap className="w-2.5 h-2.5" />
                Free
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Works on Amazon, Flipkart & Reddit
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div 
          className="relative mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Add to Chrome</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </motion.div>
      </a>
    </motion.div>
  );
}
