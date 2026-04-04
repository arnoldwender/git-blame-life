import type { BlameSummaryData } from '../data/blame';

interface BlameSummaryProps {
  summary: BlameSummaryData;
  onReset: () => void;
}

const DISTRIBUTION_COLORS: Record<string, string> = {
  'Your ex': '#ff0066',
  'Past you': '#ff6600',
  Society: '#cc44ff',
  Mercury: '#00ffff',
};

export default function BlameSummary({ summary, onReset }: BlameSummaryProps) {
  const mercuryBlame =
    100 - summary.exBlame - summary.selfBlame - summary.societyBlame;

  const bars = [
    { label: 'Your ex', pct: summary.exBlame },
    { label: 'Past you', pct: summary.selfBlame },
    { label: 'Society', pct: summary.societyBlame },
    { label: 'Mercury', pct: mercuryBlame },
  ];

  return (
    <div>
      <div className="border border-blame-primary/20 bg-blame-primary/[0.04] p-5 mb-6">
        <div className="text-[0.6rem] tracking-[4px] text-blame-primary/40 mb-4">
          BLAME SUMMARY
        </div>

        <div className="mb-4">
          <div className="text-[0.62rem] text-blame-primary/55 mb-1.5">
            TOP CONTRIBUTOR TO YOUR PROBLEMS:
          </div>
          <div
            className="text-[0.9rem] text-blame-primary"
            style={{ textShadow: '0 0 10px #cc44ff' }}
          >
            {summary.topCulprit.name}
          </div>
          <div className="text-[0.6rem] text-blame-primary/35">
            {summary.topCulprit.email} &middot; {summary.topCulprit.ago}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[0.62rem] text-blame-primary/50 mb-2">
            BLAME DISTRIBUTION:
          </div>
          {bars.map((b) => {
            const color = DISTRIBUTION_COLORS[b.label];
            return (
              <div
                key={b.label}
                className="flex items-center gap-3 mb-1.5 text-[0.65rem]"
              >
                <span className="text-blame-primary/55 min-w-[80px]">
                  {b.label}
                </span>
                <div className="flex-1 h-1 bg-blame-primary/[0.07] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${b.pct}%`,
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                </div>
                <span
                  className="min-w-[35px] text-right tabular-nums"
                  style={{ color }}
                >
                  {b.pct}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-[0.65rem] text-blame-primary/40 border-t border-blame-primary/[0.13] pt-3">
          {summary.totalCommits.toLocaleString()} commits analyzed &middot; 0 of
          them yours &middot; it's fine
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-transparent border border-blame-primary/20 text-blame-primary/40 font-mono text-[0.65rem] py-2 cursor-pointer tracking-[2px] transition-all duration-200 hover:border-blame-primary/50 hover:text-blame-primary/70"
      >
        BLAME SOMETHING ELSE
      </button>
    </div>
  );
}
