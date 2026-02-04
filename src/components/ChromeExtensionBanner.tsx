import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Zap } from 'lucide-react';
import { ChromeLogo } from '@/components/ChromeLogo';

export const CHROME_EXTENSION_URL = 'https://chromewebstore.google.com/detail/truthcart-safe-shopping-s/jcabelfgniclfkknhjgdnibicgebacpo?authuser=0&hl=en';

export function ChromeExtensionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <a
        href={CHROME_EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
      >
        {/* Shimmer animation overlay */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
        
        {/* NEW Badge */}
        <div className="absolute top-2 right-2 z-10">
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 15 }}
            className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30"
          >
            New
          </motion.div>
        </div>
        
        {/* Animated glow orbs */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors duration-500" />
        
        {/* Left content */}
        <div className="relative flex items-center gap-3">
          {/* Chrome logo with animated ring */}
          <div className="relative flex-shrink-0">
            {/* Pulsing ring */}
            <motion.div 
              className="absolute inset-0 rounded-xl bg-primary/30 blur-md"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
              <ChromeLogo className="w-6 h-6" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm tracking-tight">
                Get Chrome Extension
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold uppercase tracking-wide">
                <Zap className="w-2.5 h-2.5" />
                Free
              </span>
            </div>
            <span className="text-muted-foreground text-[11px] leading-tight">
              Works on Amazon, Flipkart & Reddit
            </span>
          </div>
        </div>
        
        {/* Right CTA button */}
        <motion.div 
          className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs whitespace-nowrap shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 mt-2 sm:mt-0 w-full sm:w-auto justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Add to Chrome</span>
          <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </motion.div>
      </a>
    </motion.div>
  );
}