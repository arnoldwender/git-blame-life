/**
 * InsightsDashboard — GitHub Insights-style stats page for life decisions.
 * Shows repository stats, language chart (decision categories),
 * and various satirical metrics in GitHub's exact layout patterns.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Decision category data — mimics GitHub's "Languages" chart */
const DECISION_CATEGORIES = [
  { name: 'Career', percentage: 34, color: '#cc44ff' },
  { name: 'Relationships', percentage: 28, color: '#ff0066' },
  { name: 'Diet', percentage: 22, color: '#00cccc' },
  { name: 'Impulse Purchases', percentage: 16, color: '#ff9900' },
];

/* Key stats in GitHub Insights format */
const REPO_STATS = [
  { label: 'Total life decisions', value: '847,293', icon: '📊' },
  { label: 'Decisions reverted', value: '412,891 (48.7%)', icon: '↩️' },
  { label: 'Longest streak without major decision', value: '847 days', sublabel: '(Netflix period)', icon: '📺' },
  { label: 'Most blamed file', value: 'career.js', sublabel: '(2,847 annotations)', icon: '📁' },
  { label: 'Bus factor', value: '1', sublabel: "(it's your life)", icon: '🚌' },
  { label: 'Open issues', value: '∞', sublabel: '(and counting)', icon: '🔴' },
  { label: 'Pull requests merged without review', value: '100%', sublabel: '(YOLO methodology)', icon: '🔀' },
  { label: 'Time spent overthinking', value: '72.4%', sublabel: '(of total uptime)', icon: '🧠' },
];

/* Top contributors to life problems */
const TOP_CONTRIBUTORS = [
  { name: 'past-you', commits: 42847, additions: 847293, deletions: 412891, avatar: '👻' },
  { name: 'your-ex', commits: 12847, additions: 0, deletions: 284712, avatar: '💔' },
  { name: 'society', commits: 8471, additions: 12, deletions: 94871, avatar: '🌍' },
  { name: 'mercury-retrograde', commits: 4847, additions: 0, deletions: 47281, avatar: '🪐' },
  { name: 'the-algorithm', commits: 3291, additions: 84729, deletions: 84729, avatar: '🤖' },
  { name: 'sleep-deprivation', commits: 2847, additions: 0, deletions: 28471, avatar: '😴' },
];

/* Fake weekly commit activity data (52 weeks) */
function generateWeeklyActivity(): number[] {
  return Array.from({ length: 52 }, (_, i) => {
    const seed = Math.abs(Math.sin(i * 7919 + 1031) * 233280) % 1;
    return Math.floor(seed * 180) + 20;
  });
}

type InsightTab = 'overview' | 'contributors' | 'traffic';

export default function InsightsDashboard() {
  const [activeTab, setActiveTab] = useState<InsightTab>('overview');
  const weeklyActivity = useMemo(generateWeeklyActivity, []);
  const maxActivity = Math.max(...weeklyActivity);

  const tabs: { id: InsightTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'contributors', label: 'Contributors' },
    { id: 'traffic', label: 'Traffic' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {/* GitHub-style Insights tabs */}
      <div className="flex gap-0 border-b border-blame-primary/15 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[0.65rem] font-mono tracking-[1px] py-2 px-4 cursor-pointer transition-all border-b-2 ${
              activeTab === tab.id
                ? 'text-blame-primary/80 border-blame-primary bg-blame-primary/[0.05]'
                : 'text-blame-primary/35 border-transparent hover:text-blame-primary/55 hover:border-blame-primary/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Languages / Decision Categories — exact GitHub style */}
            <div className="border border-blame-primary/15 bg-blame-primary/[0.02] p-4 mb-4 rounded-sm">
              <div className="text-[0.7rem] text-blame-primary/70 font-bold mb-3">
                Decision Categories
              </div>

              {/* Stacked color bar — GitHub's language bar */}
              <div className="flex h-[8px] rounded-full overflow-hidden mb-3">
                {DECISION_CATEGORIES.map((cat) => (
                  <div
                    key={cat.name}
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                ))}
              </div>

              {/* Category legend with dots */}
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {DECISION_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1.5">
                    <div
                      className="w-[10px] h-[10px] rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-[0.6rem] text-blame-primary/60 font-bold">
                      {cat.name}
                    </span>
                    <span className="text-[0.6rem] text-blame-primary/35">
                      {cat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key statistics — GitHub sidebar stats style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {REPO_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="border border-blame-primary/10 bg-blame-primary/[0.02] p-3 rounded-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">{stat.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[0.55rem] text-blame-primary/35 tracking-[1px] uppercase">
                        {stat.label}
                      </div>
                      <div className="text-[0.85rem] text-blame-primary/80 font-bold tabular-nums">
                        {stat.value}
                      </div>
                      {stat.sublabel && (
                        <div className="text-[0.5rem] text-blame-primary/25">
                          {stat.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Weekly commit activity bar chart */}
            <div className="border border-blame-primary/15 bg-blame-primary/[0.02] p-4 rounded-sm">
              <div className="text-[0.7rem] text-blame-primary/70 font-bold mb-3">
                Weekly Decision Activity
              </div>
              <div className="flex items-end gap-[2px] h-[80px]">
                {weeklyActivity.map((val, i) => {
                  const height = (val / maxActivity) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 min-w-[4px] rounded-t-[1px] transition-all hover:opacity-80"
                      style={{
                        height: `${height}%`,
                        backgroundColor: height > 70 ? '#cc44ff' : height > 40 ? '#a644cc88' : '#5a1d7a66',
                      }}
                      title={`Week ${i + 1}: ${val} decisions`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[0.45rem] text-blame-primary/20">52 weeks ago</span>
                <span className="text-[0.45rem] text-blame-primary/20">Now</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'contributors' && (
          <motion.div
            key="contributors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-[0.65rem] text-blame-primary/50 mb-3">
              {TOP_CONTRIBUTORS.length} contributors to your problems
            </div>

            {TOP_CONTRIBUTORS.map((contributor, i) => (
              <motion.div
                key={contributor.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border border-blame-primary/10 bg-blame-primary/[0.02] p-3 mb-2 rounded-sm flex items-center gap-3"
              >
                {/* Rank */}
                <div className="text-[0.6rem] text-blame-primary/25 w-4 text-right">
                  #{i + 1}
                </div>

                {/* Avatar */}
                <div className="text-xl flex-shrink-0">{contributor.avatar}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[0.7rem] text-blame-primary/70 font-bold">
                    {contributor.name}
                  </div>
                  <div className="text-[0.5rem] text-blame-primary/30">
                    {contributor.commits.toLocaleString()} commits
                  </div>
                </div>

                {/* Additions / Deletions */}
                <div className="flex gap-3 text-[0.55rem]">
                  <span className="text-green-500/60">
                    ++{contributor.additions.toLocaleString()}
                  </span>
                  <span className="text-red-500/60">
                    --{contributor.deletions.toLocaleString()}
                  </span>
                </div>

                {/* Contribution bar */}
                <div className="w-[80px] h-[6px] bg-blame-primary/[0.07] rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(contributor.commits / TOP_CONTRIBUTORS[0].commits) * 100}%`,
                      backgroundColor: '#cc44ff',
                      boxShadow: '0 0 4px #cc44ff',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'traffic' && (
          <motion.div
            key="traffic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Traffic stats — GitHub traffic page style */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-blame-primary/15 bg-blame-primary/[0.02] p-4 rounded-sm text-center">
                <div className="text-[1.5rem] text-blame-primary/80 font-bold tabular-nums">
                  2,847
                </div>
                <div className="text-[0.55rem] text-blame-primary/35">
                  Unique existential crises
                </div>
                <div className="text-[0.5rem] text-blame-primary/20 mt-1">Last 14 days</div>
              </div>
              <div className="border border-blame-primary/15 bg-blame-primary/[0.02] p-4 rounded-sm text-center">
                <div className="text-[1.5rem] text-blame-primary/80 font-bold tabular-nums">
                  14,291
                </div>
                <div className="text-[0.55rem] text-blame-primary/35">
                  Total anxiety pageviews
                </div>
                <div className="text-[0.5rem] text-blame-primary/20 mt-1">Last 14 days</div>
              </div>
            </div>

            {/* Popular content — referring sites style */}
            <div className="border border-blame-primary/15 bg-blame-primary/[0.02] p-4 rounded-sm mb-4">
              <div className="text-[0.7rem] text-blame-primary/70 font-bold mb-3">
                Popular Content (Top Files Blamed)
              </div>
              {[
                { file: 'career.js', views: 2847, uniqueBlames: 1291 },
                { file: 'relationships.ts', views: 1847, uniqueBlames: 891 },
                { file: 'diet-plan.json', views: 1291, uniqueBlames: 647 },
                { file: 'sleep-schedule.yml', views: 891, uniqueBlames: 412 },
                { file: 'bank-account.csv', views: 647, uniqueBlames: 291 },
              ].map((item, i) => (
                <div
                  key={item.file}
                  className="flex items-center gap-3 py-2 border-b border-blame-primary/[0.06] last:border-0"
                >
                  <span className="text-[0.6rem] text-blame-primary/25 w-4">{i + 1}</span>
                  <span className="text-[0.65rem] text-blame-primary/70 font-mono flex-1">
                    /{item.file}
                  </span>
                  <span className="text-[0.55rem] text-blame-primary/40 tabular-nums">
                    {item.views.toLocaleString()} views
                  </span>
                  <span className="text-[0.55rem] text-blame-primary/25 tabular-nums">
                    {item.uniqueBlames.toLocaleString()} unique
                  </span>
                </div>
              ))}
            </div>

            {/* Referring sites */}
            <div className="border border-blame-primary/15 bg-blame-primary/[0.02] p-4 rounded-sm">
              <div className="text-[0.7rem] text-blame-primary/70 font-bold mb-3">
                Referring Sources of Blame
              </div>
              {[
                { source: 'social-media.com', referrals: 4291 },
                { source: 'linkedin.com/impostor-syndrome', referrals: 2847 },
                { source: 'comparison-to-peers.net', referrals: 1847 },
                { source: 'childhood-memories.org', referrals: 891 },
                { source: 'astrology-app.io', referrals: 647 },
              ].map((item) => (
                <div
                  key={item.source}
                  className="flex items-center gap-3 py-1.5 border-b border-blame-primary/[0.06] last:border-0"
                >
                  <span className="text-[0.6rem] text-blame-primary/50 font-mono flex-1">
                    {item.source}
                  </span>
                  <span className="text-[0.55rem] text-blame-primary/35 tabular-nums">
                    {item.referrals.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
