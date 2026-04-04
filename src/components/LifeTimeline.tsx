/**
 * LifeTimeline — Visual git commit graph showing blamed decisions
 * as commits with timestamps, authors, and diffs on a branching path.
 */
import { motion } from 'framer-motion';
import type { BlameLineWithCulprit } from '../data/blame';

interface LifeTimelineProps {
  lines: BlameLineWithCulprit[];
}

/** Generates a fake timestamp relative to "now" */
function fakeTimestamp(index: number): string {
  const units = ['minutes', 'hours', 'days', 'weeks', 'months', 'years'];
  const unit = units[Math.min(index, units.length - 1)];
  const amount = Math.floor(Math.random() * 12) + 1;
  return `${amount} ${unit} ago`;
}

/** Determines branch color for visual variety */
const BRANCH_COLORS = ['#cc44ff', '#ff0066', '#00ffff', '#ff9900', '#66ff66'];

export default function LifeTimeline({ lines }: LifeTimelineProps) {
  if (lines.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="text-[0.62rem] tracking-[4px] text-blame-primary/50 mb-4">
        COMMIT HISTORY:
      </div>

      <div className="relative pl-8">
        {/* Main branch line */}
        <div
          className="absolute left-3 top-0 bottom-0 w-[2px]"
          style={{
            background: 'linear-gradient(180deg, #cc44ff 0%, #cc44ff44 100%)',
          }}
        />

        {lines.map((line, i) => {
          const branchColor = BRANCH_COLORS[i % BRANCH_COLORS.length];
          const hasBranch = i % 3 === 1;

          return (
            <motion.div
              key={`${line.hash}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.3 }}
              className="relative mb-5 group"
            >
              {/* Commit node */}
              <div
                className="absolute -left-5 top-2 w-3 h-3 rounded-full border-2 z-10"
                style={{
                  borderColor: branchColor,
                  backgroundColor: '#000',
                  boxShadow: `0 0 8px ${branchColor}`,
                }}
              />

              {/* Branch line for some commits */}
              {hasBranch && (
                <div
                  className="absolute -left-5 top-3 w-8 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, ${branchColor}, transparent)`,
                  }}
                />
              )}

              {/* Commit content */}
              <div className="border border-blame-primary/10 bg-blame-primary/[0.03] p-3 hover:border-blame-primary/25 transition-colors">
                {/* Hash + author */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.6rem] font-mono" style={{ color: branchColor }}>
                    {line.hash}
                  </span>
                  <span className="text-[0.55rem] text-blame-primary/40">
                    {line.culprit.name}
                  </span>
                  <span className="text-[0.5rem] text-blame-primary/20 ml-auto">
                    {fakeTimestamp(i)}
                  </span>
                </div>

                {/* Diff-style change */}
                <div className="text-[0.65rem] font-mono">
                  <span className="text-red-500/80">- stability</span>
                  <br />
                  <span className="text-green-500/80">+ {line.change}</span>
                </div>

                {/* Commit message */}
                <div className="text-[0.55rem] text-blame-primary/30 mt-1.5 italic">
                  "{line.culprit.name} committed: {line.change}"
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* End node */}
        <div className="relative">
          <div
            className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-blame-primary/20 border-2 border-blame-primary/40"
          />
          <div className="text-[0.55rem] text-blame-primary/25 italic pl-1">
            HEAD → main (you are here, somehow)
          </div>
        </div>
      </div>
    </div>
  );
}
