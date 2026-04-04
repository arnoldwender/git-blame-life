/**
 * MergeConflict — Two conflicting life choices shown as a git diff.
 * User resolves the conflict by picking one, with funny consequences.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCommitSound, playRevealSound } from '../utils/sound';

interface Conflict {
  title: string;
  optionA: { label: string; consequence: string };
  optionB: { label: string; consequence: string };
}

const CONFLICTS: Conflict[] = [
  {
    title: 'Career Path',
    optionA: {
      label: 'Follow your passion',
      consequence: 'Congratulations! You now sell handmade candles on Etsy and eat ramen 5 nights a week. But your Instagram looks amazing.',
    },
    optionB: {
      label: 'Take the stable corporate job',
      consequence: 'You now own a standing desk, say "circle back" unironically, and cry in your Tesla during lunch breaks. But hey, dental insurance!',
    },
  },
  {
    title: 'Friday Night',
    optionA: {
      label: 'Go out with friends',
      consequence: 'You spent $147 on drinks, lost your phone, and texted your ex at 2am. The group chat will never let you forget this.',
    },
    optionB: {
      label: 'Stay home and be responsible',
      consequence: 'You watched 6 episodes of a show you don\'t even like, ate cereal for dinner, and went to bed at 9pm like a 75-year-old. FOMO intensifies.',
    },
  },
  {
    title: 'Morning Routine',
    optionA: {
      label: 'Wake up at 5am like a CEO',
      consequence: 'You lasted 3 days. On day 4 you threw your alarm clock out the window. Your neighbor found it. Things are awkward now.',
    },
    optionB: {
      label: 'Hit snooze 7 times',
      consequence: 'You showed up to work with toothpaste on your shirt, bed head, and one sock inside out. But those extra 42 minutes were WORTH IT.',
    },
  },
  {
    title: 'Diet Decision',
    optionA: {
      label: 'Start a strict diet',
      consequence: 'You meal-prepped 14 containers of sad chicken and broccoli. By Wednesday you were eating a burger in your car crying. The containers are still in your fridge.',
    },
    optionB: {
      label: 'Treat yourself, life is short',
      consequence: 'You ordered pizza for the 4th time this week. The delivery driver knows your name. He sent you a Christmas card.',
    },
  },
  {
    title: 'Vacation Planning',
    optionA: {
      label: 'Budget backpacking trip',
      consequence: 'You slept in 12 hostels, got food poisoning twice, and your "character building" stories bore everyone at dinner parties. But the photos are fire.',
    },
    optionB: {
      label: 'Luxury all-inclusive resort',
      consequence: 'You gained 8 pounds, spent your entire savings, and your personality is now "have you seen my vacation photos?" Your bank account is in therapy.',
    },
  },
];

interface MergeConflictProps {
  onResolve?: () => void;
}

export default function MergeConflict({ onResolve }: MergeConflictProps) {
  const [currentConflict, setCurrentConflict] = useState<Conflict>(
    () => CONFLICTS[Math.floor(Math.random() * CONFLICTS.length)]
  );
  const [choice, setChoice] = useState<'a' | 'b' | null>(null);
  const [resolved, setResolved] = useState(false);

  const resolve = useCallback(
    (option: 'a' | 'b') => {
      if (resolved) return;
      setChoice(option);
      setResolved(true);
      playRevealSound();
      onResolve?.();
    },
    [resolved, onResolve]
  );

  const nextConflict = useCallback(() => {
    const next = CONFLICTS[Math.floor(Math.random() * CONFLICTS.length)];
    setCurrentConflict(next);
    setChoice(null);
    setResolved(false);
    playCommitSound();
  }, []);

  const consequence = choice === 'a'
    ? currentConflict.optionA.consequence
    : choice === 'b'
      ? currentConflict.optionB.consequence
      : '';

  return (
    <div className="mb-8">
      <div className="text-[0.62rem] tracking-[4px] text-blame-primary/50 mb-4">
        MERGE CONFLICT DETECTED:
      </div>

      <div className="border border-blame-primary/20 bg-blame-primary/[0.03] p-4">
        {/* Conflict file header */}
        <div className="text-[0.6rem] text-blame-primary/40 mb-3 font-mono">
          life/{currentConflict.title.toLowerCase().replace(/\s/g, '-')}.js
        </div>

        {/* Conflict markers */}
        <div className="font-mono text-[0.65rem] mb-4">
          <div className="text-red-500/60">{'<<<<<<< HEAD (your-brain)'}</div>

          {/* Option A */}
          <motion.div
            whileHover={!resolved ? { scale: 1.01 } : undefined}
            onClick={() => resolve('a')}
            className={`p-3 my-1 cursor-pointer transition-all border ${
              choice === 'a'
                ? 'border-green-500/40 bg-green-500/10'
                : choice === 'b'
                  ? 'border-blame-primary/5 bg-blame-primary/[0.01] opacity-40'
                  : 'border-green-500/20 bg-green-500/[0.04] hover:border-green-500/40'
            }`}
          >
            <span className="text-green-400/80">+ {currentConflict.optionA.label}</span>
          </motion.div>

          <div className="text-blame-primary/30">=======</div>

          {/* Option B */}
          <motion.div
            whileHover={!resolved ? { scale: 1.01 } : undefined}
            onClick={() => resolve('b')}
            className={`p-3 my-1 cursor-pointer transition-all border ${
              choice === 'b'
                ? 'border-green-500/40 bg-green-500/10'
                : choice === 'a'
                  ? 'border-blame-primary/5 bg-blame-primary/[0.01] opacity-40'
                  : 'border-green-500/20 bg-green-500/[0.04] hover:border-green-500/40'
            }`}
          >
            <span className="text-green-400/80">+ {currentConflict.optionB.label}</span>
          </motion.div>

          <div className="text-red-500/60">{'>>>>>>> origin/reality'}</div>
        </div>

        {/* Consequence */}
        <AnimatePresence>
          {resolved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-blame-primary/10 pt-3 mt-2">
                <div className="text-[0.55rem] tracking-[2px] text-blame-primary/40 mb-2">
                  MERGE RESULT:
                </div>
                <div className="text-[0.7rem] text-blame-primary/70 leading-relaxed">
                  {consequence}
                </div>
                <button
                  onClick={nextConflict}
                  className="mt-3 bg-transparent border border-blame-primary/20 text-blame-primary/40 font-mono text-[0.6rem] py-1.5 px-4 cursor-pointer tracking-[2px] transition-all hover:border-blame-primary/50 hover:text-blame-primary/70"
                >
                  NEXT CONFLICT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
