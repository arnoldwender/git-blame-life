/**
 * InteractiveRebase — git rebase -i view for life decisions.
 * Users can pick/reword/squash/drop/edit commits.
 * Dropping a decision triggers a "merge conflict" with alternate timeline.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCommitSound, playRevealSound } from '../utils/sound';

type RebaseAction = 'pick' | 'reword' | 'squash' | 'drop' | 'edit';

interface LifeCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  action: RebaseAction;
  /** What happens if you drop this commit — alternate timeline branch */
  dropConflict: {
    current: string;
    alternate: string;
    resolution: string;
  };
  /** Rewording result */
  rewordResult: string;
  /** Edit result */
  editResult: string;
}

const LIFE_COMMITS: LifeCommit[] = [
  {
    hash: 'a1b2c3d',
    message: 'Started drinking coffee daily',
    author: 'past-you',
    date: '8 years ago',
    action: 'pick',
    dropConflict: {
      current: 'You: functional adult with a caffeine dependency',
      alternate: 'You: well-rested but completely useless before noon',
      resolution: 'CONFLICT: Cannot remove coffee. It is load-bearing infrastructure. Your entire personality depends on this commit.',
    },
    rewordResult: 'Adopted a crippling but socially acceptable substance dependency',
    editResult: 'Amended to: switched to matcha. You now won\'t shut up about antioxidants.',
  },
  {
    hash: 'e4f5g6h',
    message: 'Chose computer science over art school',
    author: 'teenage-you',
    date: '12 years ago',
    action: 'pick',
    dropConflict: {
      current: 'You: employed, can afford rent, slightly dead inside',
      alternate: 'You: alive inside, can\'t afford rent, living in a van with \'character\'',
      resolution: 'CONFLICT: Both timelines end with you arguing on Reddit at 2am. Merge impossible.',
    },
    rewordResult: 'Traded creativity for health insurance and Stack Overflow karma',
    editResult: 'Amended to: chose computer science AND took one art elective. You now make generative art NFTs. Somehow worse.',
  },
  {
    hash: 'i7j8k9l',
    message: 'Said "I\'m fine" instead of communicating',
    author: 'every-version-of-you',
    date: '3 days ago',
    action: 'pick',
    dropConflict: {
      current: 'You: bottled everything up, feels normal',
      alternate: 'You: had a 4-hour emotional conversation, now exhausted',
      resolution: 'CONFLICT: Neither timeline includes actually processing your emotions. This is a feature, not a bug.',
    },
    rewordResult: 'Chose emotional avoidance over vulnerability (again)',
    editResult: 'Amended to: said "I\'m not fine" — everyone panicked, you panicked, the dog panicked. Reverted.',
  },
  {
    hash: 'm1n2o3p',
    message: 'Bought a $2000 mechanical keyboard',
    author: 'impulsive-you',
    date: '6 months ago',
    action: 'pick',
    dropConflict: {
      current: 'You: broke, but your typing sounds AMAZING',
      alternate: 'You: $2000 richer, typing on a mushy membrane board like an animal',
      resolution: 'CONFLICT: Your fingers have muscle memory for Cherry MX Blues. There is no going back. Your coworkers hate you.',
    },
    rewordResult: 'Invested $2000 in acoustic pollution and personal satisfaction',
    editResult: 'Amended to: bought a $200 keyboard instead. Spent saved $1800 on keycaps anyway.',
  },
  {
    hash: 'q4r5s6t',
    message: 'Started a diet on Monday',
    author: 'optimistic-you',
    date: '2 weeks ago',
    action: 'pick',
    dropConflict: {
      current: 'You: ate sad chicken for 3 days, then ordered pizza',
      alternate: 'You: skipped the pretense, ordered pizza directly on Monday',
      resolution: 'CONFLICT: Both timelines converge at "eating pizza on Wednesday." The diet was never real.',
    },
    rewordResult: 'Temporarily inconvenienced metabolism before inevitable pizza surrender',
    editResult: 'Amended to: started a "lifestyle change" (rebranded diet). Same outcome, fancier vocabulary.',
  },
  {
    hash: 'u7v8w9x',
    message: 'Adopted a cat from the shelter',
    author: 'lonely-you',
    date: '2 years ago',
    action: 'pick',
    dropConflict: {
      current: 'You: owned by a cat, furniture destroyed, heart full',
      alternate: 'You: nice furniture, empty heart, talks to plants',
      resolution: 'FATAL: Cannot drop this commit. Cat has acquired ownership of the repository. You are now a dependency.',
    },
    rewordResult: 'Voluntarily became an unpaid servant to a small, furry dictator',
    editResult: 'Amended to: adopted TWO cats. Double the destruction. Double the love. Triple the vet bills.',
  },
  {
    hash: 'y1z2a3b',
    message: 'Stayed up until 4am "just one more episode"',
    author: 'netflix-you',
    date: 'last night',
    action: 'pick',
    dropConflict: {
      current: 'You: exhausted, knows how the season ends',
      alternate: 'You: well-rested, dies of curiosity, reads spoilers anyway',
      resolution: 'CONFLICT: Sleep deprivation is a core dependency. Removing it would break 73% of your personality.',
    },
    rewordResult: 'Sacrificed tomorrow\'s productivity at the altar of fictional characters',
    editResult: 'Amended to: stopped at midnight. Lay in bed for 4 hours thinking about the show anyway.',
  },
];

const ACTION_COLORS: Record<RebaseAction, string> = {
  pick: '#22c55e',
  reword: '#a855f7',
  squash: '#eab308',
  drop: '#ef4444',
  edit: '#3b82f6',
};

const ACTION_DESCRIPTIONS: Record<RebaseAction, string> = {
  pick: 'keep this life decision as-is',
  reword: 'keep but rename for the narrative',
  squash: 'merge into previous mistake',
  drop: 'pretend this never happened',
  edit: 'amend what actually went down',
};

export default function InteractiveRebase() {
  const [commits, setCommits] = useState<LifeCommit[]>(LIFE_COMMITS);
  const [activeConflict, setActiveConflict] = useState<LifeCommit | null>(null);
  const [activeResult, setActiveResult] = useState<{ commit: LifeCommit; action: RebaseAction } | null>(null);
  const [rebasing, setRebasing] = useState(false);
  const [rebaseComplete, setRebaseComplete] = useState(false);

  /* Cycle through actions for a commit */
  const cycleAction = useCallback((hash: string) => {
    if (rebasing) return;
    const actions: RebaseAction[] = ['pick', 'reword', 'squash', 'drop', 'edit'];
    setCommits((prev) =>
      prev.map((c) => {
        if (c.hash !== hash) return c;
        const currentIndex = actions.indexOf(c.action);
        const nextAction = actions[(currentIndex + 1) % actions.length];
        return { ...c, action: nextAction };
      })
    );
    playCommitSound();
  }, [rebasing]);

  /* Execute the rebase */
  const executeRebase = useCallback(() => {
    if (rebasing) return;
    setRebasing(true);
    setActiveConflict(null);
    setActiveResult(null);

    /* Find the first non-pick commit to show a result for */
    const interestingCommit = commits.find((c) => c.action !== 'pick');

    if (!interestingCommit) {
      /* All picks — boring rebase */
      setTimeout(() => {
        setRebasing(false);
        setRebaseComplete(true);
        playRevealSound();
      }, 1000);
      return;
    }

    /* Show the action result */
    setTimeout(() => {
      if (interestingCommit.action === 'drop') {
        setActiveConflict(interestingCommit);
      } else {
        setActiveResult({ commit: interestingCommit, action: interestingCommit.action });
      }
      setRebasing(false);
      playRevealSound();
    }, 1500);
  }, [commits, rebasing]);

  /* Reset rebase state */
  const resetRebase = useCallback(() => {
    setCommits(LIFE_COMMITS);
    setActiveConflict(null);
    setActiveResult(null);
    setRebaseComplete(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {/* Header — mimics git rebase -i editor header */}
      <div className="border border-blame-primary/15 bg-blame-primary/[0.02] rounded-sm overflow-hidden">
        {/* Title bar */}
        <div className="bg-blame-primary/[0.06] border-b border-blame-primary/10 px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-[10px] h-[10px] rounded-full bg-red-500/50" />
            <div className="w-[10px] h-[10px] rounded-full bg-yellow-500/50" />
            <div className="w-[10px] h-[10px] rounded-full bg-green-500/50" />
          </div>
          <span className="text-[0.6rem] text-blame-primary/40 font-mono ml-2">
            git rebase -i HEAD~{commits.length} (interactive)
          </span>
        </div>

        {/* Instructions */}
        <div className="px-3 py-2 border-b border-blame-primary/[0.06]">
          <div className="text-[0.55rem] text-blame-primary/30 font-mono leading-relaxed">
            # Rebase your life decisions. Click the action to cycle through options.
            <br />
            # Commands: <span style={{ color: ACTION_COLORS.pick }}>pick</span> = keep,{' '}
            <span style={{ color: ACTION_COLORS.reword }}>reword</span> = rename,{' '}
            <span style={{ color: ACTION_COLORS.squash }}>squash</span> = merge,{' '}
            <span style={{ color: ACTION_COLORS.drop }}>drop</span> = remove,{' '}
            <span style={{ color: ACTION_COLORS.edit }}>edit</span> = amend
          </div>
        </div>

        {/* Commit list */}
        <div className="p-2">
          {commits.map((commit, i) => (
            <motion.div
              key={commit.hash}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-2 py-1.5 px-2 font-mono text-[0.65rem] rounded-sm transition-colors ${
                rebasing ? 'opacity-50' : 'hover:bg-blame-primary/[0.04]'
              }`}
            >
              {/* Action button */}
              <button
                onClick={() => cycleAction(commit.hash)}
                disabled={rebasing}
                className="px-2 py-0.5 rounded-sm text-[0.6rem] font-bold tracking-[1px] min-w-[60px] text-center cursor-pointer transition-all border"
                style={{
                  color: ACTION_COLORS[commit.action],
                  borderColor: ACTION_COLORS[commit.action] + '44',
                  backgroundColor: ACTION_COLORS[commit.action] + '11',
                }}
                title={ACTION_DESCRIPTIONS[commit.action]}
              >
                {commit.action}
              </button>

              {/* Hash */}
              <span className="text-blame-primary/30">{commit.hash}</span>

              {/* Message */}
              <span className={`flex-1 ${commit.action === 'drop' ? 'line-through text-blame-primary/20' : 'text-blame-primary/65'}`}>
                {commit.message}
              </span>

              {/* Author + date */}
              <span className="text-[0.5rem] text-blame-primary/20 whitespace-nowrap hidden sm:inline">
                {commit.author} &middot; {commit.date}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Execute button */}
        <div className="px-3 py-3 border-t border-blame-primary/10">
          <div className="flex gap-2">
            <button
              onClick={executeRebase}
              disabled={rebasing}
              className="flex-1 bg-transparent border border-blame-primary/30 text-blame-primary/60 font-mono text-[0.65rem] py-2 cursor-pointer tracking-[2px] transition-all hover:bg-blame-primary/[0.08] hover:border-blame-primary/60 hover:text-blame-primary/80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {rebasing ? 'REBASING...' : 'EXECUTE REBASE'}
            </button>
            <button
              onClick={resetRebase}
              className="bg-transparent border border-blame-primary/15 text-blame-primary/30 font-mono text-[0.65rem] py-2 px-3 cursor-pointer tracking-[1px] transition-all hover:border-blame-primary/30 hover:text-blame-primary/50"
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* Merge conflict popup (when dropping a decision) */}
      <AnimatePresence>
        {activeConflict && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="border border-red-500/30 bg-red-500/[0.03] rounded-sm overflow-hidden">
              {/* Conflict header */}
              <div className="bg-red-500/[0.08] border-b border-red-500/15 px-3 py-2">
                <div className="text-[0.65rem] text-red-400/80 font-bold font-mono">
                  MERGE CONFLICT — Alternate Timeline Detected
                </div>
                <div className="text-[0.5rem] text-red-400/40">
                  Dropping "{activeConflict.message}" created a paradox
                </div>
              </div>

              {/* Conflict diff */}
              <div className="p-3 font-mono text-[0.65rem]">
                <div className="text-red-500/60 mb-1">{'<<<<<<< HEAD (current timeline)'}</div>
                <div className="bg-red-500/[0.06] border-l-2 border-red-500/30 pl-3 py-1.5 mb-1 text-blame-primary/55">
                  {activeConflict.dropConflict.current}
                </div>
                <div className="text-blame-primary/25 mb-1">=======</div>
                <div className="bg-green-500/[0.06] border-l-2 border-green-500/30 pl-3 py-1.5 mb-1 text-blame-primary/55">
                  {activeConflict.dropConflict.alternate}
                </div>
                <div className="text-red-500/60 mb-3">{'>>>>>>> alternate/what-if'}</div>

                {/* Resolution */}
                <div className="border-t border-blame-primary/10 pt-3">
                  <div className="text-[0.55rem] tracking-[2px] text-red-400/50 mb-2">
                    AUTO-MERGE FAILED:
                  </div>
                  <div className="text-[0.7rem] text-red-400/70 leading-relaxed">
                    {activeConflict.dropConflict.resolution}
                  </div>
                </div>
              </div>

              <div className="px-3 pb-3">
                <button
                  onClick={() => setActiveConflict(null)}
                  className="w-full bg-transparent border border-red-500/20 text-red-400/50 font-mono text-[0.6rem] py-1.5 cursor-pointer tracking-[2px] transition-all hover:border-red-500/40 hover:text-red-400/70"
                >
                  ACCEPT CURRENT TIMELINE (YOU HAVE NO CHOICE)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action results (reword, edit, squash) */}
      <AnimatePresence>
        {activeResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="border border-blame-primary/20 bg-blame-primary/[0.03] p-4 rounded-sm">
              <div className="text-[0.6rem] tracking-[2px] mb-2"
                style={{ color: ACTION_COLORS[activeResult.action] }}
              >
                {activeResult.action === 'reword' && 'REWORD RESULT:'}
                {activeResult.action === 'edit' && 'EDIT RESULT:'}
                {activeResult.action === 'squash' && 'SQUASH RESULT:'}
              </div>

              <div className="font-mono text-[0.65rem]">
                {activeResult.action === 'reword' && (
                  <>
                    <div className="text-red-500/60 line-through mb-1">
                      - {activeResult.commit.message}
                    </div>
                    <div className="text-green-500/70">
                      + {activeResult.commit.rewordResult}
                    </div>
                  </>
                )}
                {activeResult.action === 'edit' && (
                  <div className="text-blame-primary/60 leading-relaxed">
                    {activeResult.commit.editResult}
                  </div>
                )}
                {activeResult.action === 'squash' && (
                  <div className="text-yellow-500/60 leading-relaxed">
                    Squashed into previous commit. Your mistakes are now one mega-mistake. Efficiency!
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveResult(null)}
                className="mt-3 bg-transparent border border-blame-primary/15 text-blame-primary/30 font-mono text-[0.55rem] py-1 px-3 cursor-pointer tracking-[2px] hover:text-blame-primary/50 transition-colors"
              >
                DISMISS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boring rebase complete (all picks) */}
      <AnimatePresence>
        {rebaseComplete && !activeConflict && !activeResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 border border-green-500/20 bg-green-500/[0.03] p-3 rounded-sm text-center"
          >
            <div className="text-[0.65rem] text-green-400/70 font-mono">
              Successfully rebased. Nothing changed. Your life is exactly the same. Congratulations?
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
