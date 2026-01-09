import { motion } from 'framer-motion';
import amazonLogo from '@/assets/platforms/amazon.png';
import redditLogo from '@/assets/platforms/reddit.svg';
import youtubeLogo from '@/assets/platforms/youtube.svg';

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

// Flipkart official SVG logo
const FlipkartLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 126 52" className={className} fill="none">
    <path
      d="M11.5 20.5h16.3v4.1H16.4v5.9h9.8v4H16.4v9.3h-4.9V20.5zM31.5 20.5h4.9v23.3h-4.9V20.5zM42.5 27.1h4.6v2.3c1.1-1.7 2.9-2.8 5.3-2.8 3.7 0 6 2.5 6 6.5v10.7h-4.6v-9.5c0-2.3-1.1-3.6-3.1-3.6-2.2 0-3.6 1.5-3.6 4v9.1h-4.6V27.1zM64.3 20.5h4.6v8.9c1.1-1.6 2.8-2.8 5.2-2.8 4.5 0 7.5 3.7 7.5 8.7s-3 8.7-7.5 8.7c-2.5 0-4.2-1.2-5.3-2.8v2.6h-4.5V20.5zm8.5 11c-2.4 0-4.1 1.8-4.1 4.5s1.7 4.5 4.1 4.5c2.4 0 4.1-1.8 4.1-4.5s-1.7-4.5-4.1-4.5z"
      fill="#2874F0"
    />
    <path
      d="M85.5 35.9c0-4.9 3.5-9.3 9-9.3 5.2 0 8.6 3.9 8.6 9.4v1.2H90.2c.3 2.3 1.9 3.7 4.1 3.7 1.6 0 2.9-.7 3.6-1.8l3.7 2.1c-1.4 2.3-4.1 3.8-7.4 3.8-5.5 0-8.7-4.1-8.7-9.1zm4.6-1.7h8.4c-.3-2-1.8-3.3-4-3.3-2 0-3.7 1.2-4.4 3.3zM107.5 27.1h4.5v2.4c1.1-1.8 2.9-2.9 5.2-2.9v4.7c-3 0-4.7 1-4.7 4.2v8.3h-5V27.1z"
      fill="#2874F0"
    />
    <rect x="2" y="4" width="20" height="20" rx="3" fill="#FFCC00"/>
    <polygon points="7,10 7,18 15,14" fill="#2874F0"/>
  </svg>
);

const platforms = [
  {
    name: 'Amazon',
    logo: <img src={amazonLogo} alt="Amazon" className="h-8 md:h-10 w-auto object-contain" />,
  },
  {
    name: 'Flipkart',
    logo: <FlipkartLogo className="h-6 md:h-8 w-auto" />,
  },
  {
    name: 'Reddit',
    logo: <img src={redditLogo} alt="Reddit" className="h-7 md:h-9 w-auto object-contain" />,
  },
  {
    name: 'YouTube',
    logo: <img src={youtubeLogo} alt="YouTube" className="h-6 md:h-8 w-auto object-contain" />,
  },
];

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
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {platforms.map((platform) => (
          <motion.div
            key={platform.name}
            variants={itemVariants}
            className="opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            title={platform.name}
          >
            {platform.logo}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
