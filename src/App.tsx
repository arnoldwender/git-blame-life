import { useState, useCallback } from 'react';
import CRTOverlay from './components/CRTOverlay';
import Header from './components/Header';
import BlameInput from './components/BlameInput';
import TerminalLog from './components/TerminalLog';
import BlameReport from './components/BlameReport';
import BlameSummary from './components/BlameSummary';
import {
  CULPRITS,
  BLAME_LINES,
  TERMINAL_LOGS,
  type BlameLineWithCulprit,
  type BlameSummaryData,
} from './data/blame';

type Phase = 'idle' | 'blaming' | 'done';

export default function App() {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [blameLines, setBlameLines] = useState<BlameLineWithCulprit[]>([]);
  const [summary, setSummary] = useState<BlameSummaryData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const reset = useCallback(() => {
    setPhase('idle');
    setBlameLines([]);
    setLogs([]);
    setInput('');
    setSummary(null);
  }, []);

  const blame = useCallback(() => {
    if (!input.trim()) return;
    setPhase('blaming');
    setBlameLines([]);
    setLogs([]);
    setSummary(null);

    const terminalLogs = [
      `$ git blame "${input}"`,
      ...TERMINAL_LOGS,
    ];

    let i = 0;
    const logIv = setInterval(() => {
      if (i < terminalLogs.length) {
        setLogs((prev) => [...prev, terminalLogs[i]]);
        i++;
      } else {
        clearInterval(logIv);

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

        let li = 0;
        const lineIv = setInterval(() => {
          if (li < lines.length) {
            setBlameLines((prev) => [...prev, lines[li]]);
            li++;
          } else {
            clearInterval(lineIv);
            setSummary({
              topCulprit: shuffledCulprits[0],
              totalCommits: Math.floor(Math.random() * 9000) + 1000,
              selfBlame: Math.floor(Math.random() * 40) + 10,
              exBlame: Math.floor(Math.random() * 30) + 20,
              societyBlame: Math.floor(Math.random() * 30) + 10,
            });
            setPhase('done');
          }
        }, 200);
      }
    }, 250);
  }, [input]);

  return (
    <div className="min-h-screen bg-blame-bg text-blame-primary font-mono overflow-hidden relative">
      <CRTOverlay />

      <div className="max-w-[800px] mx-auto px-6 py-8">
        <Header />
        <BlameInput
          input={input}
          setInput={setInput}
          onBlame={blame}
          isBlaming={phase === 'blaming'}
        />
        <TerminalLog logs={logs} isBlaming={phase === 'blaming'} />
        <BlameReport lines={blameLines} />
        {summary && <BlameSummary summary={summary} onReset={reset} />}

        {phase === 'idle' && (
          <div className="text-center py-8 text-blame-primary/20 text-[0.72rem] tracking-[3px]">
            <div className="text-[2.5rem] mb-4">
              <span role="img" aria-label="search">&#x1F50D;</span>
            </div>
            <div>ENTER YOUR PROBLEM. WE'LL FIND WHO'S RESPONSIBLE.</div>
            <div className="text-[0.6rem] text-blame-primary/[0.13] mt-2">
              SPOILER: IT'S NEVER YOU
            </div>
          </div>
        )}

        <footer className="border-t border-blame-primary/[0.13] pt-6 mt-4 text-center text-[0.58rem] text-blame-primary/20 tracking-[2px] leading-[2.2]">
          <div>
            GIT BLAME: LIFE IS NOT RESPONSIBLE FOR DAMAGED RELATIONSHIPS OR
            AVOIDED THERAPY
          </div>
          <div>
            BUILT BY WENDER MEDIA — WE BLAME OUR TOOLS, NOT OURSELVES
          </div>
          <div className="text-red-500/[0.13] mt-1">
            HTTP 418 — YOUR EX IS ALSO A TEAPOT
          </div>
        </footer>
      </div>
    </div>
  );
}
