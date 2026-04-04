import type { BlameLineWithCulprit } from '../data/blame';
import { severityColor } from '../utils/glitch';

interface BlameReportProps {
  lines: BlameLineWithCulprit[];
}

export default function BlameReport({ lines }: BlameReportProps) {
  if (lines.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="text-[0.62rem] tracking-[4px] text-blame-primary/50 mb-3">
        BLAME REPORT:
      </div>
      {lines.map((line, i) => (
        <div
          key={i}
          className="animate-fadein grid grid-cols-[auto_auto_1fr_auto] gap-x-2.5 items-center py-1.5 px-3 border border-blame-primary/[0.09] bg-blame-primary/[0.03] mb-[3px] text-[0.65rem] overflow-x-auto"
        >
          <span className="text-blame-primary/25 font-mono">{line.hash}</span>
          <span className="text-blame-primary/55 whitespace-nowrap">
            ({line.culprit.name})
          </span>
          <span className="text-blame-primary/70">{line.change}</span>
          <span
            className="text-[0.55rem] whitespace-nowrap font-medium"
            style={{ color: severityColor(line.severity) }}
          >
            [{line.severity}]
          </span>
        </div>
      ))}
    </div>
  );
}
