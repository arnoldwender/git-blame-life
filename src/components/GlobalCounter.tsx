/**
 * GlobalCounter — Running counter of total blames with zero responsibility accepted.
 * Uses localStorage to persist across sessions.
 */
import { motion } from 'framer-motion';

interface GlobalCounterProps {
  totalBlames: number;
}

export default function GlobalCounter({ totalBlames }: GlobalCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-3 mb-6 border border-blame-primary/10 bg-blame-primary/[0.02]"
    >
      <div className="text-[0.6rem] tracking-[3px] text-blame-primary/30">
        <motion.span
          key={totalBlames}
          initial={{ scale: 1.4, color: '#cc44ff' }}
          animate={{ scale: 1, color: 'rgba(204, 68, 255, 0.55)' }}
          transition={{ duration: 0.3 }}
          className="inline-block text-[0.8rem] font-bold mx-1 tabular-nums"
        >
          {totalBlames.toLocaleString()}
        </motion.span>
        LIFE DECISIONS BLAMED&nbsp;&nbsp;&bull;&nbsp;&nbsp;
        <span className="text-red-500/40">0</span> RESPONSIBILITIES ACCEPTED
      </div>
    </motion.div>
  );
}
