import { motion } from 'framer-motion';

const messages = [
  "🚫 TruthCart blocked a fake SSD on eBay",
  "✅ Verified safe drone found on Amazon",
  "🛡️ 97% trust score for Sony headphones",
  "🚫 Suspicious seller flagged on AliExpress",
  "✅ Genuine Apple charger verified",
  "🛡️ 500+ products analyzed today",
  "🚫 Counterfeit skincare product detected",
  "✅ Safe gaming mouse found on Newegg",
  "🛡️ 96% accuracy rate maintained",
  "✅ Trusted laptop deal verified on Best Buy",
];

export function SocialProofTicker() {
  // Double the messages for seamless loop
  const doubled = [...messages, ...messages];

  return (
    <div className="w-full overflow-hidden bg-primary/5 border-y border-primary/10 py-2.5">
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          },
        }}
      >
        {doubled.map((msg, i) => (
          <span
            key={i}
            className="text-sm text-muted-foreground font-medium inline-flex items-center gap-2 shrink-0"
          >
            {msg}
            <span className="w-1 h-1 rounded-full bg-primary/30" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
