/**
 * BlameRoulette — Spin wheel to randomly assign blame.
 * Uses canvas for the wheel and CSS animation for the spin.
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTickSound, playRevealSound } from '../utils/sound';
import { firePurpleConfetti } from '../utils/confetti';

const SEGMENTS = [
  { label: 'Parents', color: '#cc44ff' },
  { label: 'That One Friend', color: '#ff0066' },
  { label: 'Mercury Retrograde', color: '#00cccc' },
  { label: 'Stack Overflow', color: '#ff9900' },
  { label: 'Your Ex', color: '#ff3366' },
  { label: 'Late Stage Capitalism', color: '#9900cc' },
  { label: 'The Weather', color: '#6666ff' },
  { label: 'WiFi Connection', color: '#33cc33' },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

interface BlameRouletteProps {
  onResult?: (label: string) => void;
  onSpin?: () => void;
}

export default function BlameRoulette({ onResult, onSpin }: BlameRouletteProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Draw the wheel on canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 4;

    ctx.clearRect(0, 0, size, size);

    SEGMENTS.forEach((seg, i) => {
      const startAngle = (i * SEGMENT_ANGLE * Math.PI) / 180;
      const endAngle = ((i + 1) * SEGMENT_ANGLE * Math.PI) / 180;

      /* Segment fill */
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color + '33';
      ctx.fill();
      ctx.strokeStyle = seg.color + '66';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Label */
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + (SEGMENT_ANGLE * Math.PI) / 360);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.color;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(seg.label, radius - 10, 4);
      ctx.restore();
    });

    /* Center circle */
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0010';
    ctx.fill();
    ctx.strokeStyle = '#cc44ff66';
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Center text */
    ctx.fillStyle = '#cc44ff';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', center, center);
  }, []);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    onSpin?.();

    /* Random final rotation (3-6 full spins + random offset) */
    const spins = 3 + Math.random() * 3;
    const extraDeg = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + extraDeg;
    setRotation(totalRotation);

    /* Tick sounds during spin */
    let tickSpeed = 50;
    tickIntervalRef.current = setInterval(() => {
      playTickSound();
    }, tickSpeed);

    /* Slow down ticks over time */
    const slowdownSteps = [
      { delay: 500, speed: 80 },
      { delay: 1200, speed: 120 },
      { delay: 2000, speed: 200 },
      { delay: 2800, speed: 350 },
    ];
    slowdownSteps.forEach(({ delay, speed }) => {
      setTimeout(() => {
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
          tickIntervalRef.current = setInterval(() => playTickSound(), speed);
        }
      }, delay);
    });

    /* Determine result after spin */
    setTimeout(() => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }

      /* Calculate which segment is at the top (pointer at 0deg / top) */
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const segIndex = Math.floor(normalizedAngle / SEGMENT_ANGLE) % SEGMENTS.length;
      const winner = SEGMENTS[segIndex].label;

      setResult(winner);
      setSpinning(false);
      playRevealSound();
      firePurpleConfetti();
      onResult?.(winner);
    }, 3500);
  }, [spinning, rotation, onResult, onSpin]);

  /* Cleanup tick interval on unmount */
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="text-[0.62rem] tracking-[4px] text-blame-primary/50 mb-4">
        BLAME ROULETTE:
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Pointer triangle at top */}
        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[14px] border-l-transparent border-r-transparent border-t-blame-primary" />

        {/* Wheel container */}
        <div className="relative">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{
              duration: 3.5,
              ease: [0.15, 0.85, 0.25, 1],
            }}
          >
            <canvas
              ref={canvasRef}
              width={260}
              height={260}
              className="cursor-pointer"
              onClick={spin}
            />
          </motion.div>
        </div>

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning}
          className="bg-transparent border border-blame-primary/40 text-blame-primary/70 font-mono text-[0.7rem] py-2 px-6 cursor-pointer tracking-[2px] transition-all duration-200 hover:bg-blame-primary/10 hover:border-blame-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {spinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
        </button>

        {/* Result display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center border border-blame-primary/30 bg-blame-primary/[0.06] p-4 w-full max-w-[300px]"
            >
              <div className="text-[0.55rem] tracking-[3px] text-blame-primary/40 mb-1">
                THE BLAME FALLS ON:
              </div>
              <div
                className="text-[1.1rem] text-blame-primary font-bold tracking-[2px]"
                style={{ textShadow: '0 0 15px #cc44ff' }}
              >
                {result}
              </div>
              <div className="text-[0.5rem] text-blame-primary/25 mt-1">
                100% scientifically accurate
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
