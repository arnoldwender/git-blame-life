/**
 * AchievementNotification — Toast notification when an achievement unlocks.
 * Also a panel showing all achievements and their unlock status.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../hooks/useAchievements';

interface NotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: NotificationProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          onClick={onDismiss}
          className="fixed top-4 left-1/2 z-[10000] cursor-pointer"
        >
          <div
            className="border border-blame-primary/40 bg-black px-5 py-3 flex items-center gap-3"
            style={{ boxShadow: '0 0 30px rgba(204, 68, 255, 0.3)' }}
          >
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <div className="text-[0.6rem] tracking-[3px] text-blame-primary/40">
                ACHIEVEMENT UNLOCKED
              </div>
              <div className="text-[0.8rem] text-blame-primary font-bold">
                {achievement.title}
              </div>
              <div className="text-[0.55rem] text-blame-primary/45">
                {achievement.description}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementPanelProps {
  achievements: Achievement[];
}

export function AchievementPanel({ achievements }: AchievementPanelProps) {
  const [open, setOpen] = useState(false);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-transparent border border-blame-primary/15 text-blame-primary/40 font-mono text-[0.6rem] py-2 cursor-pointer tracking-[2px] transition-all hover:border-blame-primary/30 hover:text-blame-primary/60 flex items-center justify-center gap-2"
      >
        <span>ACHIEVEMENTS</span>
        <span className="text-blame-primary/60">{unlockedCount}/{achievements.length}</span>
        <span className="text-[0.5rem]">{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`border p-2.5 flex items-center gap-2.5 transition-colors ${
                    a.unlocked
                      ? 'border-blame-primary/25 bg-blame-primary/[0.05]'
                      : 'border-blame-primary/[0.07] bg-blame-primary/[0.01] opacity-40'
                  }`}
                >
                  <span className={`text-lg ${a.unlocked ? '' : 'grayscale'}`}>
                    {a.unlocked ? a.icon : '🔒'}
                  </span>
                  <div>
                    <div className="text-[0.6rem] text-blame-primary/70 font-bold">
                      {a.title}
                    </div>
                    <div className="text-[0.5rem] text-blame-primary/35">
                      {a.unlocked ? a.description : '???'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
