/**
 * EasterEggHandler — Detects secret inputs and shows special responses.
 * "git push --force" → monster warning
 * "my own fault" → redirect to external blame
 * "everything" → equal blame pie chart
 */
import { motion, AnimatePresence } from 'framer-motion';

interface EasterEgg {
  type: 'force-push' | 'self-blame' | 'everything' | null;
}

interface EasterEggDisplayProps {
  egg: EasterEgg;
  onDismiss: () => void;
}

/** Checks input for easter egg triggers — returns egg type or null */
export function detectEasterEgg(input: string): EasterEgg['type'] {
  const lower = input.toLowerCase().trim();
  if (lower.includes('git push --force') || lower.includes('git push -f')) return 'force-push';
  if (lower === 'my own fault' || lower === 'my fault' || lower === 'myself') return 'self-blame';
  if (lower === 'everything') return 'everything';
  return null;
}

/* Equal blame pie chart — simple SVG */
function BlamePieChart() {
  const segments = [
    { label: 'Parents', color: '#cc44ff', start: 0 },
    { label: 'Ex', color: '#ff0066', start: 45 },
    { label: 'Society', color: '#00cccc', start: 90 },
    { label: 'Mercury', color: '#ff9900', start: 135 },
    { label: 'Weather', color: '#6666ff', start: 180 },
    { label: 'WiFi', color: '#33cc33', start: 225 },
    { label: 'Capitalism', color: '#9900cc', start: 270 },
    { label: 'Monday', color: '#ff6600', start: 315 },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {segments.map((seg, i) => {
          const startAngle = (seg.start * Math.PI) / 180;
          const endAngle = ((seg.start + 45) * Math.PI) / 180;
          const x1 = 90 + 80 * Math.cos(startAngle);
          const y1 = 90 + 80 * Math.sin(startAngle);
          const x2 = 90 + 80 * Math.cos(endAngle);
          const y2 = 90 + 80 * Math.sin(endAngle);

          return (
            <path
              key={i}
              d={`M 90 90 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`}
              fill={seg.color + '44'}
              stroke={seg.color}
              strokeWidth="1"
            />
          );
        })}
        <circle cx="90" cy="90" r="25" fill="#000" stroke="#cc44ff44" strokeWidth="1" />
        <text x="90" y="90" textAnchor="middle" dominantBaseline="central" fill="#cc44ff" fontSize="8" fontFamily="monospace">
          12.5% each
        </text>
      </svg>
      <div className="grid grid-cols-4 gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2" style={{ backgroundColor: seg.color }} />
            <span className="text-[0.55rem] text-blame-primary/50">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EasterEggDisplay({ egg, onDismiss }: EasterEggDisplayProps) {
  if (!egg.type) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="mb-6 border border-blame-primary/30 bg-blame-primary/[0.05] p-5"
      >
        {egg.type === 'force-push' && (
          <div className="text-center">
            <div className="text-3xl mb-3">💀</div>
            <div
              className="text-[1rem] text-red-400 font-bold mb-2"
              style={{ textShadow: '0 0 15px #ff0000' }}
            >
              You monster.
            </div>
            <div className="text-[0.7rem] text-blame-primary/55">
              There is no undo in life. <code className="text-red-400/70">--force</code> only works on other people's code.
            </div>
            <div className="text-[0.55rem] text-blame-primary/25 mt-2">
              git reflog can't save you from your choices.
            </div>
          </div>
        )}

        {egg.type === 'self-blame' && (
          <div className="text-center">
            <div className="text-3xl mb-3">🚫</div>
            <div
              className="text-[1rem] text-yellow-400 font-bold mb-2"
              style={{ textShadow: '0 0 15px #ffcc00' }}
            >
              ERROR 403: Self-blame not supported
            </div>
            <div className="text-[0.7rem] text-blame-primary/55">
              Redirecting to external blame source...
            </div>
            <div className="text-[0.55rem] text-blame-primary/25 mt-2 font-mono">
              $ blame --target=literally-anyone-else --confidence=100%
            </div>
          </div>
        )}

        {egg.type === 'everything' && (
          <div className="text-center">
            <div className="text-[0.6rem] tracking-[3px] text-blame-primary/40 mb-4">
              UNIVERSAL BLAME DISTRIBUTION
            </div>
            <BlamePieChart />
            <div className="text-[0.55rem] text-blame-primary/30 mt-3">
              When everything is to blame, nothing is. Deep.
            </div>
          </div>
        )}

        <button
          onClick={onDismiss}
          className="mt-4 w-full bg-transparent border border-blame-primary/15 text-blame-primary/30 font-mono text-[0.55rem] py-1.5 cursor-pointer tracking-[2px] hover:text-blame-primary/50 transition-colors"
        >
          DISMISS
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
