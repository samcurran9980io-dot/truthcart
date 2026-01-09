import { motion } from 'framer-motion';

const platforms = [
  {
    name: 'Amazon',
    logo: (
      <svg viewBox="0 0 100 30" className="h-5 md:h-6 w-auto fill-current">
        <path d="M62.4 22.3c-5.9 4.3-14.4 6.6-21.7 6.6-10.3 0-19.5-3.8-26.5-10.1-.5-.5-.1-1.2.6-.8 7.5 4.4 16.9 7 26.5 7 6.5 0 13.6-1.3 20.2-4.1 1-.4 1.8.7.9 1.4z"/>
        <path d="M65 19.5c-.7-.9-4.9-.5-6.8-.2-.6.1-.7-.4-.1-.8 3.3-2.3 8.7-1.7 9.3-.9.6.8-.2 6.4-3.3 9-.5.4-.9.2-.7-.3.7-1.6 2.3-5.8 1.6-6.8z"/>
        <path d="M58.4 3.2V.8c0-.4.3-.6.6-.6h10.7c.4 0 .6.3.6.6v2.1c0 .4-.3.8-.9 1.6l-5.6 7.9c2.1-.1 4.3.3 6.1 1.4.4.2.5.6.6 1v2.6c0 .4-.4.8-.8.6-3.5-1.8-8-2-11.9.1-.4.2-.8-.2-.8-.6v-2.5c0-.4 0-1.1.4-1.7l6.4-9.2h-5.6c-.4 0-.6-.3-.6-.6zm-39.5 14.9h-3.3c-.3 0-.6-.3-.6-.6V.8c0-.4.3-.6.7-.6h3c.3 0 .6.3.6.6v2.3h.1c.8-2.2 2.4-3.2 4.5-3.2 2.2 0 3.5 1 4.5 3.2.8-2.2 2.6-3.2 4.7-3.2 1.4 0 3 .6 3.9 1.9 1.1 1.5.9 3.6.9 5.5v10c0 .4-.3.6-.7.6h-3.2c-.4 0-.6-.3-.6-.6V8c0-.7.1-2.6-.1-3.3-.3-1.1-1-1.5-2-1.5-.8 0-1.7.5-2 1.4-.4.9-.3 2.3-.3 3.4v9.3c0 .4-.3.6-.7.6h-3.2c-.4 0-.6-.3-.6-.6V8c0-1.9.3-4.8-2.1-4.8-2.4 0-2.3 2.8-2.3 4.8v9.3c0 .4-.3.7-.7.7zm60.2-14.8c4.9 0 7.5 4.2 7.5 9.5 0 5.1-2.9 9.2-7.5 9.2-4.8 0-7.4-4.2-7.4-9.4 0-5.2 2.6-9.3 7.4-9.3zm0 3.4c-2.4 0-2.6 3.3-2.6 5.4 0 2 0 6.4 2.5 6.4s2.6-3.5 2.6-5.7c0-1.4-.1-3.1-.5-4.4-.4-1.1-1.1-1.7-2-1.7zM91 18.1h-3.2c-.4 0-.6-.3-.6-.6V.7c0-.3.3-.6.7-.6h3c.3 0 .6.2.6.5v2.6h.1c.9-2.3 2.2-3.4 4.5-3.4 1.5 0 3 .5 4 2 .9 1.4.9 3.7.9 5.4v10.2c-.1.3-.4.5-.7.5h-3.2c-.3 0-.6-.2-.6-.5V8c0-1.9.2-4.7-2.2-4.7-.8 0-1.6.6-2 1.4-.5 1.1-.5 2.2-.5 3.4v9.3c0 .4-.4.7-.8.7zM49.9 10.3c0 1.3 0 2.4-.7 3.6-.5 1-1.4 1.5-2.3 1.5-1.3 0-2-1-2-2.4 0-2.9 2.6-3.4 5-3.4v.7zm3.4 8.2c-.2.2-.5.2-.8.1-.9-.8-1.1-1.4-1.6-2.4-1.5 1.6-2.6 2-4.6 2-2.3 0-4.2-1.4-4.2-4.3 0-2.3 1.2-3.8 3-4.6 1.5-.7 3.6-.8 5.3-1v-.4c0-.7.1-1.5-.4-2.1-.4-.5-1.1-.7-1.7-.7-1.2 0-2.2.6-2.5 1.9-.1.3-.3.5-.5.5l-3.1-.3c-.2-.1-.5-.3-.4-.7C42.5 2.8 46 2 49.1 2c1.6 0 3.6.4 4.9 1.6 1.6 1.5 1.4 3.5 1.4 5.7v5.1c0 1.5.6 2.2 1.2 3 .2.3.3.6 0 .8l-2.4 2.1-.9-.8z"/>
      </svg>
    ),
  },
  {
    name: 'Flipkart',
    logo: (
      <svg viewBox="0 0 100 30" className="h-5 md:h-6 w-auto fill-current">
        <path d="M10.7 7.2H6.2v16.6h4.5V7.2zm-2.2-5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm9.5 5h-4.2v16.6h4.5v-9c0-2.4 1.5-3.6 3.6-3.6.5 0 1 .1 1.5.2V7c-.4-.1-.8-.1-1.2-.1-2.2 0-3.7 1.2-4.2 2.8V7.2zm15.8 0h-4.5v1.5c-1-1.2-2.5-1.9-4.3-1.9-4 0-7.2 3.5-7.2 8.6s3.2 8.6 7.2 8.6c1.8 0 3.3-.7 4.3-1.9v1.5h4.5V7.2zm-7.2 12.7c-2.3 0-4-1.8-4-4.5s1.7-4.5 4-4.5 4 1.8 4 4.5-1.7 4.5-4 4.5zm17.6-12.7h-4.5v16.6h4.5V7.2zm-2.2-5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z"/>
        <path d="M62.3 7c-4.8 0-8.5 3.6-8.5 8.5s3.7 8.5 8.5 8.5c3.3 0 6.1-1.7 7.6-4.3l-3.8-1.8c-.8 1.4-2.2 2.2-3.8 2.2-2 0-3.6-1.2-4.1-3h12.3v-1.6c0-4.9-3.7-8.5-8.2-8.5zm-3.9 6.8c.5-1.8 2-3 3.9-3s3.4 1.2 3.9 3h-7.8zm21.9-6.8c-1.8 0-3.3.7-4.3 1.9V7.2h-4.5v16.6h4.5v-9c0-2.4 1.5-3.6 3.3-3.6 1.8 0 3.1 1.2 3.1 3.6v9h4.5v-9.6c0-4.5-2.7-7.2-6.6-7.2zm18.7 0h-3.5V2.8h-4.5V7h-2.5v4h2.5v6.7c0 4.3 1.7 6.3 6.4 6.3 1.2 0 2.4-.2 3.4-.6v-3.8c-.7.2-1.4.4-2.1.4-1.6 0-2.3-.7-2.3-2.5V11h3.5V7h.1z"/>
      </svg>
    ),
  },
  {
    name: 'Reddit',
    logo: (
      <svg viewBox="0 0 100 30" className="h-5 md:h-6 w-auto fill-current">
        <circle cx="14" cy="15" r="12"/>
        <circle cx="14" cy="15" r="8" className="fill-background"/>
        <circle cx="11" cy="13" r="2"/>
        <circle cx="17" cy="13" r="2"/>
        <path d="M10 18c0 0 2 3 4 3s4-3 4-3" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"/>
        <circle cx="22" cy="7" r="3"/>
        <path d="M20 9l4 4" strokeWidth="2" stroke="currentColor" strokeLinecap="round"/>
        <text x="30" y="20" fontSize="14" fontWeight="bold">reddit</text>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    logo: (
      <svg viewBox="0 0 100 30" className="h-5 md:h-6 w-auto fill-current">
        <path d="M25.9 5.2c-.9-.4-6.3-.5-11-.5s-10.1.1-11 .5C2.2 5.8 1 8.2 1 15s1.2 9.2 2.9 9.8c.9.4 6.3.5 11 .5s10.1-.1 11-.5c1.7-.6 2.9-3 2.9-9.8s-1.2-9.2-2.9-9.8zM11 20V10l8 5-8 5z"/>
        <text x="32" y="20" fontSize="12" fontWeight="600">YouTube</text>
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function PlatformLogos() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-6 border-t border-border/50"
    >
      <p className="text-center text-xs text-muted-foreground mb-4">
        Trusted data from leading platforms
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {platforms.map((platform) => (
          <motion.div
            key={platform.name}
            variants={itemVariants}
            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300"
            title={platform.name}
          >
            {platform.logo}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
