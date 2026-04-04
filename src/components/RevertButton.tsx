/**
 * RevertButton — "git revert" a life decision.
 * Shows cascading animated consequences of undoing it.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playRevealSound } from '../utils/sound';

interface RevertScenario {
  decision: string;
  consequences: string[];
}

const SCENARIOS: RevertScenario[] = [
  {
    decision: 'Getting a college degree',
    consequences: [
      'Reverting degree.js... removing 4 years of student debt',
      'Side effect: Also removed all those "networking" friendships',
      'WARNING: LinkedIn profile now shows "School of Hard Knocks"',
      'CRITICAL: Lost ability to say "well actually, in my thesis..."',
      'Merge conflict: You still owe Sallie Mae somehow',
    ],
  },
  {
    decision: 'Adopting that cat',
    consequences: [
      'Reverting cat.js... removing emotional support animal',
      'Side effect: Furniture no longer scratched. Feels too clean.',
      'WARNING: 3am wake-up-call service discontinued',
      'CRITICAL: Lost the only creature that tolerates you',
      'Fatal: Loneliness increased by 847%. Cat has been restored.',
    ],
  },
  {
    decision: 'Moving to the big city',
    consequences: [
      'Reverting city-life.js... restoring hometown.backup',
      'Side effect: Rent decreased 400%. Excitement decreased 400%.',
      'WARNING: Your parents are thrilled. Suspiciously thrilled.',
      'CRITICAL: The one good coffee shop closed in 2019',
      'Merge conflict: You\'re the same person who wanted to leave',
    ],
  },
  {
    decision: 'Starting to drink coffee',
    consequences: [
      'Reverting caffeine.js... this will hurt',
      'Side effect: Headache detected. Headache intensifying.',
      'WARNING: Productivity dropped to 3%. Personality became "tired".',
      'CRITICAL: Your coworkers no longer recognize you without a mug',
      'Fatal: Revert failed. Coffee is load-bearing. Cannot remove.',
    ],
  },
  {
    decision: 'Joining social media',
    consequences: [
      'Reverting social-media.js... deleting digital footprint',
      'Side effect: You no longer know what your ex had for breakfast',
      'WARNING: FOMO levels approaching critical mass',
      'CRITICAL: Nobody knows you exist anymore. Were you ever real?',
      'Merge conflict: You already screenshot everything. The internet remembers.',
    ],
  },
  {
    decision: 'Learning to code',
    consequences: [
      'Reverting learn-to-code.js... removing tech brain',
      'Side effect: You no longer see everything as "just an API"',
      'WARNING: Can no longer blame Stack Overflow for life problems',
      'CRITICAL: Lost ability to say "it works on my machine"',
      'Fatal: You\'re using a computer to revert knowing computers. Paradox detected.',
    ],
  },
];

interface RevertButtonProps {
  onRevert?: () => void;
}

export default function RevertButton({ onRevert }: RevertButtonProps) {
  const [reverting, setReverting] = useState(false);
  const [scenario, setScenario] = useState<RevertScenario | null>(null);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  const doRevert = useCallback(() => {
    if (reverting) return;
    const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setScenario(s);
    setVisibleLines([]);
    setReverting(true);
    playRevealSound();
    onRevert?.();

    /* Cascade lines one by one */
    s.consequences.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        if (i === s.consequences.length - 1) {
          setReverting(false);
        }
      }, (i + 1) * 700);
    });
  }, [reverting, onRevert]);

  return (
    <div className="mb-8">
      <button
        onClick={doRevert}
        disabled={reverting}
        className="w-full bg-transparent border border-red-500/30 text-red-500/70 font-mono text-[0.7rem] py-3 px-5 cursor-pointer tracking-[2px] transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/60 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {reverting ? 'REVERTING...' : 'GIT REVERT (UNDO A LIFE DECISION)'}
      </button>

      <AnimatePresence>
        {scenario && visibleLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 border border-red-500/15 bg-red-500/[0.03] p-4 overflow-hidden"
          >
            <div className="text-[0.6rem] tracking-[3px] text-red-500/50 mb-3">
              REVERTING: "{scenario.decision}"
            </div>

            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-[0.65rem] font-mono py-1 ${
                  line.startsWith('Fatal') || line.startsWith('CRITICAL')
                    ? 'text-red-400/80'
                    : line.startsWith('WARNING')
                      ? 'text-yellow-500/70'
                      : 'text-blame-primary/50'
                }`}
              >
                {line}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
