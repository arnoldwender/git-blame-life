/**
 * CLIMode — Terminal emulator showing git commands and satirical output.
 * Full interactive CLI experience where users type commands.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playTypeSound, playCommitSound } from '../utils/sound';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'warning';
  text: string;
}

/* Command responses — mapped to git commands with satirical output */
const COMMANDS: Record<string, string[]> = {
  'git status': [
    'On branch main',
    'Your branch is behind \'origin/adulthood\' by 847 commits.',
    '',
    'Changes not staged for commit:',
    '  (use "git add <file>..." to update what will be committed)',
    '',
    '  modified:   career.js',
    '  modified:   relationships.ts',
    '  modified:   bank-account.csv',
    '  deleted:    motivation.js',
    '  deleted:    sleep-schedule.yml',
    '',
    'Untracked files:',
    '  (use "git add <file>..." to include in what will be committed)',
    '',
    '  anxiety.js',
    '  existential-dread.ts',
    '  impulse-purchases/',
    '  subscriptions-you-forgot-about/',
    '',
    'no changes added to commit (use "git add" to accept responsibility)',
  ],
  'git log': [
    'commit a1b2c3d (HEAD -> main, origin/denial)',
    'Author: past-you <why-did-i@do-that.com>',
    'Date:   3 hours ago',
    '',
    '    Committed without thinking. Again.',
    '',
    'commit e4f5g6h',
    'Author: your-ex <definitely-not-thinking-about@them.com>',
    'Date:   847 days ago',
    '',
    '    Removed happiness module. No revert available.',
    '',
    'commit i7j8k9l',
    'Author: mercury-retrograde <planets@not-aligned.space>',
    'Date:   last week',
    '',
    '    Force-pushed chaos into stable branch.',
    '',
    'commit m1n2o3p (tag: rock-bottom-v2)',
    'Author: capitalism <hustle@grindset.biz>',
    'Date:   1776',
    '',
    '    Initial commit. Added requirement: work until death.',
  ],
  'git diff': [
    'diff --git a/life.js b/life.js',
    'index 847293..000000 100644',
    '--- a/life.js',
    '+++ b/life.js',
    '@@ -1,7 +1,7 @@',
    '-const motivation = require("ambition");',
    '+const motivation = null; // TODO: fix later',
    '-const sleep = 8; // hours',
    '+const sleep = 4; // "hours" (lies)',
    '-const savings = 42000;',
    '+const savings = -847; // how',
    '-const mentalHealth = "stable";',
    '+const mentalHealth = "it\'s fine"; // narrator: it was not fine',
  ],
  'git blame life.js': [
    'a1b2c3d (your-ex          847 days ago) const love = undefined;',
    'e4f5g6h (past-you         3 years ago)  const ambition = "later";',
    'i7j8k9l (society          centuries ago) const expectations = Infinity;',
    'm1n2o3p (mercury          last week)    const plans = null; // retrograde',
    'q4r5s6t (sleep-deprivation last night)  const energy = 0;',
    'u7v8w9x (the-algorithm    2019)         const attention = "scattered";',
    'y1z2a3b (imposter-syndrome always)      const confidence = false;',
  ],
  'git branch': [
    '  alternate/art-school',
    '  alternate/said-yes-to-that-trip',
    '  alternate/talked-to-that-person',
    '  backup/before-everything-went-wrong',
    '  feature/get-your-life-together (abandoned)',
    '  hotfix/emergency-pizza',
    '* main',
    '  origin/adulthood (847 commits ahead)',
    '  stash/emotions-2019',
    '  wip/new-years-resolutions (expired)',
  ],
  'git stash list': [
    'stash@{0}: WIP on main: emotions from last Tuesday',
    'stash@{1}: On main: that thing you were gonna say but didn\'t',
    'stash@{2}: On main: motivation (stashed 3 years ago)',
    'stash@{3}: On main: New Year\'s resolutions 2024',
    'stash@{4}: On main: New Year\'s resolutions 2023',
    'stash@{5}: On main: New Year\'s resolutions 2022',
    'stash@{6}: On main: feelings about that email',
    'stash@{7}: On main: courage to make that phone call',
    'stash@{847}: On main: first stash (childhood dreams)',
  ],
  'git remote -v': [
    'origin    git@github.com:your-life/main.git (fetch)',
    'origin    git@github.com:your-life/main.git (push)',
    'parents   git@github.com:expectations/unrealistic.git (fetch)',
    'society   git@github.com:norms/outdated.git (fetch)',
    'linkedin  git@github.com:humble-brags/toxic-positivity.git (push)',
    'therapy   git@github.com:self-help/expensive.git (fetch) (push) (please)',
  ],
  'git reflog': [
    'a1b2c3d HEAD@{0}: commit: another bad decision',
    'e4f5g6h HEAD@{1}: commit: undid the good decision',
    'i7j8k9l HEAD@{2}: revert: tried to fix things (made worse)',
    'm1n2o3p HEAD@{3}: commit: 3am online shopping',
    'q4r5s6t HEAD@{4}: merge: merged anxiety and caffeine',
    'u7v8w9x HEAD@{5}: reset: tried to forget (failed)',
    'y1z2a3b HEAD@{6}: commit: said "yes" when meant "no"',
    'c4d5e6f HEAD@{7}: commit: googled symptoms at midnight',
  ],
  'git push': [
    'error: failed to push some refs to \'origin/adulthood\'',
    'hint: Updates were rejected because you have not done anything',
    'hint: productive since the last push. Integrate the responsible',
    'hint: decisions before pushing again.',
    'hint: See \'git help get-your-life-together\' for more information.',
  ],
  'git pull': [
    'remote: Enumerating responsibilities... done.',
    'remote: Counting obligations... done.',
    'remote: Compressing expectations... done.',
    'Receiving objects: 100% (847/847), 42.00 MiB | 0 bytes/s',
    'error: Your local branch has diverged from reality.',
    'hint: You have 847 un-addressed responsibilities.',
    'hint: Use "git blame someone-else" to deflect.',
  ],
  'git commit -m "fix everything"': [
    'error: nothing to commit (you haven\'t actually fixed anything)',
    'hint: Did you mean "git commit -m \'pretend everything is fine\'"?',
  ],
  help: [
    'Git Blame: Life Edition — Available Commands:',
    '',
    '  git status        Show the state of your life',
    '  git log           View your decision history',
    '  git diff          See what you\'ve changed (for worse)',
    '  git blame life.js Who\'s responsible for this mess',
    '  git branch        List alternate timelines',
    '  git stash list    Things you\'re avoiding',
    '  git remote -v     External influences',
    '  git reflog        Things you can\'t undo',
    '  git push          Try to move forward (will fail)',
    '  git pull          Face your responsibilities',
    '  clear             Clear terminal',
    '  help              Show this message',
    '',
    '  Any other input will be judged accordingly.',
  ],
};

/* Fallback responses for unrecognized commands */
const FALLBACK_RESPONSES = [
  ['bash: command not found. Much like your motivation.'],
  ['Permission denied. Story of your life.'],
  ['Segmentation fault (core dumped). Just like your plans.'],
  ['Error: ENOENT: no such file or directory. Like your savings account.'],
  ['Fatal: not a git repository. Neither is your life, apparently.'],
  ['Command not recognized. Neither are your achievements by your parents.'],
];

export default function CLIMode() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'Git Blame: Life Edition v6.6.6' },
    { type: 'output', text: 'Type "help" for available commands.' },
    { type: 'output', text: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll to bottom when new lines are added */
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  /* Focus input when clicking anywhere in terminal */
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* Process a command */
  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    /* Add input line */
    const newLines: TerminalLine[] = [
      { type: 'input', text: `$ ${cmd}` },
    ];

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    /* Find matching command */
    const response = COMMANDS[trimmed];
    if (response) {
      response.forEach((line) => {
        const isError = line.startsWith('error:') || line.startsWith('Fatal:') || line.startsWith('fatal:');
        const isWarning = line.startsWith('hint:') || line.startsWith('warning:');
        const isSuccess = line.startsWith('Successfully') || line.includes('done.');
        newLines.push({
          type: isError ? 'error' : isWarning ? 'warning' : isSuccess ? 'success' : 'output',
          text: line,
        });
      });
    } else {
      /* Random fallback */
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      fallback.forEach((line) => {
        newLines.push({ type: 'error', text: line });
      });
    }

    newLines.push({ type: 'output', text: '' });
    setLines((prev) => [...prev, ...newLines]);
    playCommitSound();
  }, []);

  /* Handle key events */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      executeCommand(currentInput);
      setCommandHistory((prev) => [currentInput, ...prev]);
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else {
      playTypeSound();
    }
  }, [currentInput, commandHistory, historyIndex, executeCommand]);

  /* Color helper for line types */
  const lineColor = (type: TerminalLine['type']): string => {
    switch (type) {
      case 'input': return 'text-blame-primary/80';
      case 'error': return 'text-red-400/70';
      case 'warning': return 'text-yellow-500/60';
      case 'success': return 'text-green-400/70';
      default: return 'text-blame-primary/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {/* Terminal window */}
      <div className="border border-blame-primary/20 rounded-sm overflow-hidden">
        {/* Title bar */}
        <div className="bg-blame-primary/[0.08] border-b border-blame-primary/15 px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-[10px] h-[10px] rounded-full bg-red-500/50" />
            <div className="w-[10px] h-[10px] rounded-full bg-yellow-500/50" />
            <div className="w-[10px] h-[10px] rounded-full bg-green-500/50" />
          </div>
          <span className="text-[0.6rem] text-blame-primary/40 font-mono ml-2">
            blame-terminal — bash — 80x24
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={terminalRef}
          onClick={focusInput}
          className="bg-black p-3 h-[400px] overflow-y-auto cursor-text font-mono text-[0.65rem] leading-relaxed"
        >
          {/* Rendered lines */}
          {lines.map((line, i) => (
            <div
              key={i}
              className={`${lineColor(line.type)} whitespace-pre-wrap break-all`}
            >
              {line.text || '\u00A0'}
            </div>
          ))}

          {/* Active input line */}
          <div className="flex items-center">
            <span className="text-blame-primary/60 mr-1">$</span>
            <input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-blame-primary/80 font-mono text-[0.65rem] caret-blame-primary"
              style={{ caretColor: '#cc44ff' }}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <span className="w-[7px] h-[14px] bg-blame-primary/60 animate-blink inline-block" />
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-blame-primary/[0.04] border-t border-blame-primary/10 px-3 py-1 flex justify-between">
          <span className="text-[0.5rem] text-blame-primary/25 font-mono">
            branch: main (847 commits behind reality)
          </span>
          <span className="text-[0.5rem] text-blame-primary/25 font-mono">
            {lines.length} lines | UTF-8 | bash
          </span>
        </div>
      </div>
    </motion.div>
  );
}
