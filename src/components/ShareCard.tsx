/**
 * ShareCard — "My Git Blame Report" shareable image generator.
 * Uses html2canvas to capture a styled card as an image.
 */
import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import type { BlameSummaryData } from '../data/blame';

interface ShareCardProps {
  summary: BlameSummaryData;
  decision: string;
}

export default function ShareCard({ summary, decision }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current || generating) return;
    setGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });

      /* Try Web Share API first, fall back to download */
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setGenerating(false);
          return;
        }

        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], 'git-blame-report.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'My Git Blame Report',
                text: `Apparently ${summary.topCulprit.name} is responsible for "${decision}". Zero accountability achieved.`,
                files: [file],
              });
              setGenerating(false);
              return;
            }
          } catch {
            /* Share cancelled or not supported — fall through to download */
          }
        }

        /* Fallback: download */
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'git-blame-report.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setGenerating(false);
      }, 'image/png');
    } catch {
      setGenerating(false);
    }
  }, [generating, summary, decision]);

  const mercuryBlame = 100 - summary.exBlame - summary.selfBlame - summary.societyBlame;

  return (
    <div className="mb-8">
      {/* The card to capture */}
      <div
        ref={cardRef}
        className="border border-blame-primary/20 bg-black p-6 mb-3"
        style={{ maxWidth: 420 }}
      >
        {/* Card header */}
        <div className="text-center mb-4">
          <div className="text-[0.55rem] tracking-[4px] text-blame-primary/40 mb-1">
            MY GIT BLAME REPORT
          </div>
          <div
            className="text-[1rem] text-blame-primary font-bold tracking-[2px]"
            style={{ textShadow: '0 0 12px #cc44ff' }}
          >
            "{decision}"
          </div>
        </div>

        {/* Top contributor */}
        <div className="text-center mb-4 py-3 border-y border-blame-primary/15">
          <div className="text-[0.5rem] tracking-[2px] text-blame-primary/35 mb-1">
            TOP CONTRIBUTOR TO MY PROBLEMS
          </div>
          <div
            className="text-[1.2rem] text-blame-primary"
            style={{ textShadow: '0 0 15px #cc44ff' }}
          >
            {summary.topCulprit.name}
          </div>
          <div className="text-[0.5rem] text-blame-primary/25">
            {summary.topCulprit.email}
          </div>
        </div>

        {/* Blame bars */}
        <div className="mb-3">
          {[
            { label: 'Your ex', pct: summary.exBlame, color: '#ff0066' },
            { label: 'Past you', pct: summary.selfBlame, color: '#ff6600' },
            { label: 'Society', pct: summary.societyBlame, color: '#cc44ff' },
            { label: 'Mercury', pct: mercuryBlame, color: '#00ffff' },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2 mb-1 text-[0.6rem]">
              <span className="text-blame-primary/45 min-w-[65px]">{bar.label}</span>
              <div className="flex-1 h-1 bg-blame-primary/[0.07] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${bar.pct}%`,
                    background: bar.color,
                    boxShadow: `0 0 4px ${bar.color}`,
                  }}
                />
              </div>
              <span className="min-w-[28px] text-right tabular-nums" style={{ color: bar.color }}>
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-[0.5rem] text-blame-primary/20 pt-2 border-t border-blame-primary/10">
          {summary.totalCommits.toLocaleString()} commits analyzed &bull; 0 responsibilities accepted
          <br />
          <span style={{ color: '#cc44ff44' }}>git-blame.life</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={generateImage}
          disabled={generating}
          className="flex-1 bg-transparent border border-blame-primary/30 text-blame-primary/60 font-mono text-[0.65rem] py-2 cursor-pointer tracking-[2px] transition-all hover:bg-blame-primary/[0.06] hover:text-blame-primary/80 disabled:opacity-40"
        >
          {generating ? 'GENERATING...' : 'SHARE BLAME CARD'}
        </motion.button>
      </div>
    </div>
  );
}
