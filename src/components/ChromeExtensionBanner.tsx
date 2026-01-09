import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Zap } from 'lucide-react';
import { ChromeLogo } from '@/components/ChromeLogo';

// Update this URL when your extension is published on the Chrome Web Store
export const CHROME_EXTENSION_URL = '#';

export function ChromeExtensionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="mb-8"
    >
      <a
        href={CHROME_EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-between gap-3 md:gap-6 p-3 md:p-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
      >
        {/* Shimmer animation overlay */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
        
        {/* NEW Badge */}
        <div className="absolute -top-1 -right-1 md:top-2 md:right-2 z-10">
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 15 }}
            className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30"
          >
            New
          </motion.div>
        </div>
        
        {/* Animated glow orbs */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors duration-500" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/25 transition-colors duration-500" />
        
        {/* Left content */}
        <div className="relative flex items-center gap-3 md:gap-4">
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
            <div className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
              <ChromeLogo className="w-6 h-6 md:w-7 md:h-7" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm md:text-base tracking-tight">
                Get Chrome Extension
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] md:text-xs font-semibold uppercase tracking-wide">
                <Zap className="w-2.5 h-2.5 md:w-3 md:h-3" />
                Free
              </span>
            </div>
            <span className="text-muted-foreground text-[11px] md:text-sm leading-tight">
              <span className="hidden sm:inline">Works on </span>Amazon, Flipkart & Reddit
            </span>
          </div>
        </div>
        
        {/* Right CTA button */}
        <motion.div 
          className="relative flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs md:text-sm whitespace-nowrap shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Add to Chrome</span>
          <span className="sm:hidden">Install</span>
          <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </motion.div>
      </a>
    </motion.div>
  );
}