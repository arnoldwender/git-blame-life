import { useEffect, useRef } from 'react';

interface TerminalLogProps {
  logs: string[];
  isBlaming: boolean;
}

export default function TerminalLog({ logs, isBlaming }: TerminalLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div
      ref={logRef}
      className="bg-blame-dark border border-blame-primary/[0.13] p-3 h-40 overflow-y-auto mb-6 text-[0.68rem] leading-[1.9]"
    >
      {logs.map((log, i) => (
        <div
          key={i}
          className={
            log.startsWith('WARNING')
              ? 'text-[#ff9900]'
              : log.startsWith('$')
                ? 'text-blame-primary'
                : 'text-blame-primary/50'
          }
          style={{ textShadow: '0 0 4px currentColor' }}
        >
          {log}
        </div>
      ))}
      {isBlaming && (
        <span className="animate-blink text-blame-primary">&#x2588;</span>
      )}
    </div>
  );
}
