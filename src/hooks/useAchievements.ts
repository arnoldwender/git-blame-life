/**
 * Achievement system — tracks blame milestones and unlocks.
 * Persists to localStorage so achievements survive reloads.
 */
import { useState, useCallback, useEffect } from 'react';
import { playAchievementSound } from '../utils/sound';
import { fireAchievementConfetti } from '../utils/confetti';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-blame',
    title: 'First Blame',
    description: 'Blamed someone for the very first time',
    icon: '🎯',
  },
  {
    id: 'blame-shifter',
    title: 'Blame Shifter',
    description: 'Blamed 5 different things',
    icon: '🔀',
  },
  {
    id: 'zero-accountability',
    title: 'Zero Accountability',
    description: '10 blames without self-blame',
    icon: '🏆',
  },
  {
    id: 'blame-addict',
    title: 'Blame Addict',
    description: '25 total blames — you need help',
    icon: '💉',
  },
  {
    id: 'roulette-spinner',
    title: 'Wheel of Misfortune',
    description: 'Spun the blame roulette',
    icon: '🎰',
  },
  {
    id: 'merge-resolver',
    title: 'Conflict Resolver',
    description: 'Resolved a life merge conflict',
    icon: '🔧',
  },
  {
    id: 'reverter',
    title: 'ctrl+Z Life',
    description: 'Reverted a life decision',
    icon: '⏪',
  },
  {
    id: 'easter-egg',
    title: 'Hidden Commit',
    description: 'Found an easter egg',
    icon: '🥚',
  },
];

const STORAGE_KEY = 'git-blame-life-achievements';
const COUNT_KEY = 'git-blame-life-counts';

interface Counts {
  totalBlames: number;
  selfBlames: number;
}

function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: Record<string, number> = JSON.parse(raw);
      return ACHIEVEMENT_DEFS.map((def) => ({
        ...def,
        unlocked: !!saved[def.id],
        unlockedAt: saved[def.id] || undefined,
      }));
    }
  } catch {
    /* ignore */
  }
  return ACHIEVEMENT_DEFS.map((def) => ({ ...def, unlocked: false }));
}

function loadCounts(): Counts {
  try {
    const raw = localStorage.getItem(COUNT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { totalBlames: 0, selfBlames: 0 };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [counts, setCounts] = useState<Counts>(loadCounts);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  /* Persist whenever achievements change */
  useEffect(() => {
    const map: Record<string, number> = {};
    achievements.forEach((a) => {
      if (a.unlocked && a.unlockedAt) map[a.id] = a.unlockedAt;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(COUNT_KEY, JSON.stringify(counts));
  }, [counts]);

  const unlock = useCallback(
    (id: string) => {
      setAchievements((prev) => {
        const existing = prev.find((a) => a.id === id);
        if (!existing || existing.unlocked) return prev;

        const updated = prev.map((a) =>
          a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
        );
        const unlocked = updated.find((a) => a.id === id)!;
        setNewlyUnlocked(unlocked);
        playAchievementSound();
        fireAchievementConfetti();

        /* Auto-dismiss notification after 3s */
        setTimeout(() => setNewlyUnlocked(null), 3000);
        return updated;
      });
    },
    []
  );

  const recordBlame = useCallback(
    (isSelfBlame: boolean) => {
      setCounts((prev) => {
        const next = {
          totalBlames: prev.totalBlames + 1,
          selfBlames: prev.selfBlames + (isSelfBlame ? 1 : 0),
        };
        localStorage.setItem(COUNT_KEY, JSON.stringify(next));

        /* Check milestones */
        if (next.totalBlames >= 1) unlock('first-blame');
        if (next.totalBlames >= 5) unlock('blame-shifter');
        if (next.totalBlames >= 10 && next.selfBlames === 0) unlock('zero-accountability');
        if (next.totalBlames >= 25) unlock('blame-addict');

        return next;
      });
    },
    [unlock]
  );

  const dismissNotification = useCallback(() => setNewlyUnlocked(null), []);

  return {
    achievements,
    counts,
    newlyUnlocked,
    unlock,
    recordBlame,
    dismissNotification,
  };
}
