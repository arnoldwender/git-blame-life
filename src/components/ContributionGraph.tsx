/**
 * ContributionGraph — GitHub-style yearly heatmap for "life decisions per day."
 * 52 columns x 7 rows CSS grid with exact GitHub green shades remapped to purple.
 * Hover tooltips show satirical decision descriptions.
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/* GitHub green shades remapped to blame purple palette */
const LEVEL_COLORS = [
  '#161b22',   /* Level 0 — no decisions (GitHub empty cell) */
  '#5a1d7a',   /* Level 1 — low */
  '#7b2fa0',   /* Level 2 — medium-low */
  '#a644cc',   /* Level 3 — medium-high */
  '#cc44ff',   /* Level 4 — max chaos */
];

/* Satirical decision descriptions keyed by day-of-year for tooltip variety */
const DECISION_SNIPPETS = [
  'mass-renamed variables at 4:47 PM on a Friday',
  'deployed to prod during a fire drill',
  'chose pizza over salad again',
  'argued with someone wrong on the internet',
  'texted ex "hey" at 2am then panicked',
  'adopted a new framework instead of finishing the project',
  'bought something from an Instagram ad at 3am',
  'said "sure, I can do that" without reading requirements',
  'googled own symptoms, now convinced of rare tropical disease',
  'started a new hobby that will last exactly 11 days',
  'pretended to be on mute when actually not muted',
  'replied-all to a company-wide email',
  'trusted a "quick 5-minute fix" that took 7 hours',
  'told someone "I\'m fine" (was not fine)',
  'rebase instead of merge — broke everything',
  'ignored the check engine light for the 84th day',
  'ate cereal for dinner while standing over the sink',
  'liked own post from a finsta account',
  'said "on my way" while still in bed',
  'spent 3 hours picking a font, used Helvetica',
  'committed .env to public repo',
  'opened 47 Chrome tabs instead of dealing with feelings',
  'scheduled a meeting that could have been an email',
  'rage-quit a video game and immediately reopened it',
  'subscribed to another streaming service',
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

interface DayData {
  date: Date;
  level: number;
  count: number;
  snippet: string;
}

/** Generate a full year of deterministic-looking random data */
function generateYearData(): DayData[] {
  const days: DayData[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  /* Align to start of week (Sunday) */
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let i = 0; i < 371; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    /* Seeded pseudo-random using date for consistency across renders */
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const rand = Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % 1;

    /* Weight distribution: more empty/low days, fewer chaotic days */
    let level: number;
    if (rand < 0.15) level = 0;
    else if (rand < 0.40) level = 1;
    else if (rand < 0.65) level = 2;
    else if (rand < 0.85) level = 3;
    else level = 4;

    /* Weekends are slightly more chaotic */
    const dayOfWeek = date.getDay();
    if ((dayOfWeek === 0 || dayOfWeek === 6) && level < 4 && rand > 0.3) {
      level = Math.min(level + 1, 4);
    }

    const count = level === 0 ? 0 : Math.floor(rand * 8) + level;
    const snippetIndex = Math.floor(rand * DECISION_SNIPPETS.length);

    days.push({
      date,
      level,
      count,
      snippet: DECISION_SNIPPETS[snippetIndex],
    });
  }

  return days;
}

interface TooltipData {
  x: number;
  y: number;
  day: DayData;
}

export default function ContributionGraph() {
  const yearData = useMemo(() => generateYearData(), []);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  /* Build the grid: 52 columns x 7 rows */
  const weeks: DayData[][] = [];
  for (let i = 0; i < yearData.length; i += 7) {
    weeks.push(yearData.slice(i, i + 7));
  }

  /* Calculate month label positions */
  const monthPositions = useMemo(() => {
    const positions: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, colIndex) => {
      const firstDay = week[0];
      if (firstDay && firstDay.date.getMonth() !== lastMonth) {
        lastMonth = firstDay.date.getMonth();
        positions.push({ label: MONTH_LABELS[lastMonth], col: colIndex });
      }
    });
    return positions;
  }, [weeks]);

  /* Total decisions count */
  const totalDecisions = yearData.reduce((sum, d) => sum + d.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {/* GitHub-style header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[0.7rem] text-blame-primary/70">
          {totalDecisions.toLocaleString()} life decisions in the last year
        </div>
      </div>

      {/* Graph container with GitHub border style */}
      <div className="border border-blame-primary/15 bg-blame-primary/[0.02] p-4 rounded-sm overflow-x-auto">
        {/* Month labels row */}
        <div className="flex ml-[30px] mb-1">
          {monthPositions.map((mp, i) => (
            <div
              key={i}
              className="text-[0.55rem] text-blame-primary/40 absolute-ish"
              style={{
                marginLeft: i === 0 ? `${mp.col * 14}px` : `${(mp.col - (monthPositions[i - 1]?.col ?? 0)) * 14 - 20}px`,
                minWidth: '20px',
              }}
            >
              {mp.label}
            </div>
          ))}
        </div>

        {/* Grid area: day labels + cells */}
        <div className="flex gap-[2px]">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-[2px] mr-1 flex-shrink-0">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[0.5rem] text-blame-primary/30 h-[12px] w-[24px] flex items-center"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Contribution cells — 52 columns x 7 rows */}
          {weeks.map((week, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-[2px]">
              {week.map((day, rowIndex) => (
                <div
                  key={`${colIndex}-${rowIndex}`}
                  className="w-[12px] h-[12px] rounded-[2px] cursor-pointer transition-all duration-100 hover:ring-1 hover:ring-blame-primary/50"
                  style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                      day,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend: Coasting -> Chaotic */}
        <div className="flex items-center justify-end gap-1.5 mt-3">
          <span className="text-[0.5rem] text-blame-primary/30">Coasting</span>
          {LEVEL_COLORS.map((color, i) => (
            <div
              key={i}
              className="w-[12px] h-[12px] rounded-[2px]"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-[0.5rem] text-blame-primary/30">Chaotic</span>
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-[10000] pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-[#1b1f23] border border-blame-primary/30 px-3 py-2 rounded text-center whitespace-nowrap"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
          >
            <div className="text-[0.65rem] text-blame-primary/90 font-bold">
              {tooltip.day.count === 0
                ? 'No decisions'
                : `${tooltip.day.count} decision${tooltip.day.count > 1 ? 's' : ''}`}
              {' '}on {tooltip.day.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </div>
            {tooltip.day.count > 0 && (
              <div className="text-[0.55rem] text-blame-primary/50 mt-0.5">
                {tooltip.day.snippet}
              </div>
            )}
          </div>
          {/* Tooltip arrow */}
          <div className="w-0 h-0 mx-auto border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1b1f23]" />
        </div>
      )}
    </motion.div>
  );
}
