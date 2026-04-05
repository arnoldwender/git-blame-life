/**
 * TabNav — Navigation tabs for switching between app sections.
 * Styled as terminal-like tabs matching the CRT aesthetic.
 */
import { motion } from 'framer-motion';

export type TabId = 'blame' | 'roulette' | 'conflict' | 'review' | 'graph' | 'insights' | 'changelog';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'blame', label: 'GIT BLAME', icon: '>' },
  { id: 'roulette', label: 'ROULETTE', icon: '⟳' },
  { id: 'conflict', label: 'MERGE CONFLICT', icon: '⇋' },
  { id: 'review', label: 'PR REVIEW', icon: '✎' },
  { id: 'graph', label: 'GRAPH', icon: '▦' },
  { id: 'insights', label: 'INSIGHTS', icon: '◉' },
  { id: 'changelog', label: 'CHANGELOG', icon: '⬡' },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex gap-[2px] mb-6 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 min-w-0 font-mono text-[0.6rem] tracking-[1.5px] py-2.5 px-3 cursor-pointer transition-all border-t-2 ${
              isActive
                ? 'bg-blame-primary/[0.08] text-blame-primary border-t-blame-primary border-l border-r border-blame-primary/20 border-b-0'
                : 'bg-transparent text-blame-primary/30 border-t-transparent border border-blame-primary/[0.08] hover:text-blame-primary/50 hover:bg-blame-primary/[0.03]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blame-primary/[0.06]"
                transition={{ duration: 0.2 }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">
              {tab.icon} {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
