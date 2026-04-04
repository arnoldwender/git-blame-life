/**
 * App — Main orchestrator for Git Blame: Life Edition.
 * Integrates blame engine, roulette, merge conflicts, PR reviews,
 * achievements, easter eggs, sounds, confetti, and share cards.
 */
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CRTOverlay from './components/CRTOverlay';
import Header from './components/Header';
import BlameInput from './components/BlameInput';
import TerminalLog from './components/TerminalLog';
import BlameReport from './components/BlameReport';
import BlameSummary from './components/BlameSummary';
import LifeTimeline from './components/LifeTimeline';
import BlameRoulette from './components/BlameRoulette';
import MergeConflict from './components/MergeConflict';
import RevertButton from './components/RevertButton';
import PRReview from './components/PRReview';
import GlobalCounter from './components/GlobalCounter';
import ShareCard from './components/ShareCard';
import TabNav, { type TabId } from './components/TabNav';
import { AchievementToast, AchievementPanel } from './components/AchievementNotification';
import EasterEggDisplay, { detectEasterEgg } from './components/EasterEggHandler';
import { useAchievements } from './hooks/useAchievements';
import { playTypeSound, playRevealSound, playCommitSound } from './utils/sound';
import { firePurpleConfetti } from './utils/confetti';
import {
  CULPRITS,
  BLAME_LINES,
  TERMINAL_LOGS,
  type BlameLineWithCulprit,
  type BlameSummaryData,
} from './data/blame';

type Phase = 'idle' | 'blaming' | 'done';

export default function App() {
  /* Core blame state */
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [blameLines, setBlameLines] = useState<BlameLineWithCulprit[]>([]);
  const [summary, setSummary] = useState<BlameSummaryData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastDecision, setLastDecision] = useState('');

  /* Tab navigation */
  const [activeTab, setActiveTab] = useState<TabId>('blame');

  /* Easter eggs */
  const [easterEgg, setEasterEgg] = useState<{ type: 'force-push' | 'self-blame' | 'everything' | null }>({ type: null });

  /* Achievements */
  const {
    achievements,
    counts,
    newlyUnlocked,
    unlock,
    recordBlame,
    dismissNotification,
  } = useAchievements();

  /* Reset blame state to start fresh */
  const reset = useCallback(() => {
    setPhase('idle');
    setBlameLines([]);
    setLogs([]);
    setInput('');
    setSummary(null);
  }, []);

  /* Handle input changes with typing sounds */
  const handleInputChange = useCallback((val: string) => {
    setInput(val);
    playTypeSound();
  }, []);

  /* Main blame engine — runs the terminal animation sequence */
  const blame = useCallback(() => {
    if (!input.trim()) return;

    /* Check for easter eggs first */
    const egg = detectEasterEgg(input);
    if (egg) {
      setEasterEgg({ type: egg });
      unlock('easter-egg');
      playRevealSound();
      return;
    }

    setPhase('blaming');
    setBlameLines([]);
    setLogs([]);
    setSummary(null);
    setLastDecision(input);

    const terminalLogs = [
      `$ git blame "${input}"`,
      ...TERMINAL_LOGS,
    ];

    /* Terminal log animation — reveals lines sequentially */
    let i = 0;
    const logIv = setInterval(() => {
      if (i < terminalLogs.length) {
        setLogs((prev) => [...prev, terminalLogs[i]]);
        playTypeSound();
        i++;
      } else {
        clearInterval(logIv);

        /* Generate blame lines with random culprits */
        const shuffledLines = [...BLAME_LINES]
          .sort(() => 0.5 - Math.random())
          .slice(0, 7);
        const shuffledCulprits = [...CULPRITS].sort(
          () => 0.5 - Math.random()
        );
        const lines: BlameLineWithCulprit[] = shuffledLines.map(
          (line, idx) => ({
            ...line,
            culprit: shuffledCulprits[idx % shuffledCulprits.length],
          })
        );

        /* Blame line reveal animation */
        let li = 0;
        const lineIv = setInterval(() => {
          if (li < lines.length) {
            setBlameLines((prev) => [...prev, lines[li]]);
            playCommitSound();
            li++;
          } else {
            clearInterval(lineIv);

            /* Build summary data */
            const summaryData: BlameSummaryData = {
              topCulprit: shuffledCulprits[0],
              totalCommits: Math.floor(Math.random() * 9000) + 1000,
              selfBlame: Math.floor(Math.random() * 40) + 10,
              exBlame: Math.floor(Math.random() * 30) + 20,
              societyBlame: Math.floor(Math.random() * 30) + 10,
            };

            setSummary(summaryData);
            setPhase('done');
            playRevealSound();
            firePurpleConfetti();

            /* Track blame for achievements and counter */
            const isSelfBlame = shuffledCulprits[0].name === 'past-you';
            recordBlame(isSelfBlame);
          }
        }, 200);
      }
    }, 250);
  }, [input, recordBlame, unlock]);

  /* Tab-specific content rendered based on active section */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'blame':
        return (
          <motion.div
            key="blame"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BlameInput
              input={input}
              setInput={handleInputChange}
              onBlame={blame}
              isBlaming={phase === 'blaming'}
            />

            {/* Easter egg display */}
            <EasterEggDisplay
              egg={easterEgg}
              onDismiss={() => setEasterEgg({ type: null })}
            />

            <TerminalLog logs={logs} isBlaming={phase === 'blaming'} />

            {/* Timeline view of blamed commits */}
            {blameLines.length > 0 && <LifeTimeline lines={blameLines} />}

            <BlameReport lines={blameLines} />

            {summary && (
              <>
                <BlameSummary summary={summary} onReset={reset} />
                <div className="mt-4" />
                <ShareCard summary={summary} decision={lastDecision} />
              </>
            )}

            {/* Revert button — available after blame completes */}
            {phase === 'done' && (
              <RevertButton onRevert={() => unlock('reverter')} />
            )}

            {/* Idle state prompt */}
            {phase === 'idle' && !easterEgg.type && (
              <div className="text-center py-8 text-blame-primary/20 text-[0.72rem] tracking-[3px]">
                <div className="text-[2.5rem] mb-4">
                  <span role="img" aria-label="search">&#x1F50D;</span>
                </div>
                <div>ENTER YOUR PROBLEM. WE'LL FIND WHO'S RESPONSIBLE.</div>
                <div className="text-[0.6rem] text-blame-primary/[0.13] mt-2">
                  SPOILER: IT'S NEVER YOU
                </div>
                <div className="text-[0.5rem] text-blame-primary/[0.1] mt-3">
                  TRY: "git push --force" &bull; "my own fault" &bull; "everything"
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'roulette':
        return (
          <motion.div
            key="roulette"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BlameRoulette
              onSpin={() => unlock('roulette-spinner')}
              onResult={(label) => {
                recordBlame(false);
                setLastDecision(`Blame Roulette: ${label}`);
              }}
            />
          </motion.div>
        );

      case 'conflict':
        return (
          <motion.div
            key="conflict"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MergeConflict onResolve={() => unlock('merge-resolver')} />
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PRReview decision={lastDecision} />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-blame-bg text-blame-primary font-mono overflow-hidden relative">
      <CRTOverlay />

      {/* Achievement unlock toast */}
      <AchievementToast
        achievement={newlyUnlocked}
        onDismiss={dismissNotification}
      />

      <div className="max-w-[800px] mx-auto px-6 py-8">
        <Header />

        {/* Global blame counter */}
        <GlobalCounter totalBlames={counts.totalBlames} />

        {/* Section navigation tabs */}
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content with exit/enter animations */}
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>

        {/* Achievements panel */}
        <AchievementPanel achievements={achievements} />

        {/* Footer */}
        <footer className="border-t border-blame-primary/[0.13] pt-6 mt-4 text-center text-[0.58rem] text-blame-primary/20 tracking-[2px] leading-[2.2]">
          <div>
            GIT BLAME: LIFE IS NOT RESPONSIBLE FOR DAMAGED RELATIONSHIPS OR
            AVOIDED THERAPY
          </div>
          <div>
            BUILT BY ARNOLD WENDER — WE BLAME OUR TOOLS, NOT OURSELVES
          </div>
          <div className="text-red-500/[0.13] mt-1">
            HTTP 418 — YOUR EX IS ALSO A TEAPOT
          </div>
        </footer>
      </div>
    </div>
  );
}
