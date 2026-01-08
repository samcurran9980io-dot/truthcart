import { motion } from 'framer-motion';
import { Chrome, ExternalLink, Sparkles } from 'lucide-react';
import { ChromeLogo } from '@/components/ChromeLogo';

// Update this URL when your extension is published on the Chrome Web Store
export const CHROME_EXTENSION_URL = '#';

export function ChromeExtensionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="mb-8"
    >
      <a
        href={CHROME_EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border border-border/50 bg-gradient-to-r from-card via-card to-primary/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
      >
        {/* Background glow effect */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/15 transition-colors duration-300" />
        
        {/* Left content */}
        <div className="relative flex items-center gap-4">
          {/* Chrome logo with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <ChromeLogo className="w-7 h-7" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm md:text-base">
                Get the Chrome Extension
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Free
              </span>
            </div>
            <span className="text-muted-foreground text-xs md:text-sm">
              Works on Amazon, Flipkart & Reddit – One-click analysis
            </span>
          </div>
        </div>
        
        {/* Right CTA button */}
        <div className="relative flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl bg-foreground text-background font-medium text-sm whitespace-nowrap group-hover:bg-primary transition-colors duration-200">
          <span className="hidden md:inline">Add to Chrome</span>
          <span className="md:hidden">Install</span>
          <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>
      </a>
    </motion.div>
  );
}