/**
 * Changelog — Fake version history and Pro tier pricing page.
 * Satirical release notes + enterprise-grade blame distribution plans.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Release history entries */
interface Release {
  version: string;
  date: string;
  tag: 'latest' | 'stable' | 'deprecated' | 'cursed';
  tagColor: string;
  highlights: string[];
  breaking?: string[];
  bugfixes?: string[];
}

const RELEASES: Release[] = [
  {
    version: 'v6.6.6',
    date: 'April 4, 2026',
    tag: 'latest',
    tagColor: '#22c55e',
    highlights: [
      'Added blame for decisions you haven\'t made yet (predictive blame)',
      'Now supports blaming people who left your life 10 years ago',
      'New: Blame across parallel universes (multiverse branch support)',
      'Interactive rebase: rewrite your life history (results may vary)',
    ],
    breaking: [
      'Removed self-accountability module (never used anyway)',
      'Deprecated "taking responsibility" — use blame.redirect() instead',
    ],
    bugfixes: [
      'Fixed issue where blame occasionally pointed to the correct person',
      'Resolved race condition between denial and acceptance',
    ],
  },
  {
    version: 'v5.0.0',
    date: 'January 1, 2026',
    tag: 'stable',
    tagColor: '#3b82f6',
    highlights: [
      'Enterprise Blame Distribution — blame across teams, departments, and timezones',
      'Added real-time blame streaming via WebSocket (BlameSockets)',
      'New: Blame as a Service (BaaS) API endpoints',
    ],
    breaking: [
      'Minimum blame radius increased from 1 person to "everyone you\'ve ever met"',
    ],
    bugfixes: [
      'Fixed memory leak in the regret accumulator',
      'Patched vulnerability where users could accidentally take ownership of mistakes',
    ],
  },
  {
    version: 'v4.2.0',
    date: 'October 31, 2025',
    tag: 'cursed',
    tagColor: '#ff9900',
    highlights: [
      'Halloween special: Blame ghosts of exes past',
      'Added Mercury Retrograde integration (automatic blame amplification)',
      'New: Blame-driven development (BDD) methodology whitepaper',
    ],
    bugfixes: [
      'Fixed infinite loop when blaming yourself for blaming yourself',
      'Resolved timezone issue: Mercury is retrograde everywhere now',
    ],
  },
  {
    version: 'v3.0.0',
    date: 'July 4, 2025',
    tag: 'deprecated',
    tagColor: '#ef4444',
    highlights: [
      'Independence Day release: declared independence from accountability',
      'Added blame import/export (share blame with friends!)',
      'New: Blame inheritance — pass blame to future children',
    ],
    breaking: [
      'Dropped support for "balanced perspective" (low adoption)',
      'Removed "forgiveness" module — incompatible with core architecture',
    ],
  },
  {
    version: 'v2.0.0',
    date: 'March 14, 2025',
    tag: 'stable',
    tagColor: '#3b82f6',
    highlights: [
      'Pi Day release: calculated blame to infinite decimal places',
      'Added AI-powered blame suggestions (GPT-Blame)',
      'New: Blame graph visualization (it\'s just a circle pointing outward)',
    ],
    bugfixes: [
      'Fixed rounding error where 0.1% blame was being self-assigned',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'January 1, 2025',
    tag: 'stable',
    tagColor: '#3b82f6',
    highlights: [
      'Initial release: "It\'s everyone else\'s fault"',
      'Core blame engine with O(1) deflection time',
      'Basic support for blaming parents, exes, and the weather',
    ],
  },
];

/* Pro tier plans */
interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For casual blamers',
    features: [
      'Blame up to 5 people/day',
      'Basic blame distribution',
      'Mercury Retrograde calendar',
      'Community blame support',
    ],
    cta: 'CURRENT PLAN',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'For serial deflectors',
    features: [
      'Unlimited blame targets',
      'Predictive blame (AI-powered)',
      'Blame across timezones',
      'Priority blame resolution',
      'Custom blame templates',
      'Blame analytics dashboard',
      'No ads (we blame them too)',
    ],
    cta: 'BLAME HARDER',
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Enterprise',
    price: '$49.99',
    period: '/seat/month',
    description: 'For organizations in denial',
    features: [
      'Everything in Pro',
      'Team blame distribution',
      'Cross-department blame routing',
      'Blame SLA (99.9% uptime)',
      'SSO (Single Sign-On blame)',
      'Compliance reports (blame audit trail)',
      'Dedicated blame consultant',
      'Custom blame integrations (Jira, Slack, Therapy)',
      '24/7 blame support hotline',
    ],
    cta: 'CONTACT SALES',
    badge: 'ENTERPRISE',
  },
];

type ChangelogTab = 'releases' | 'pricing';

export default function Changelog() {
  const [activeTab, setActiveTab] = useState<ChangelogTab>('releases');
  const [expandedVersion, setExpandedVersion] = useState<string>('v6.6.6');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      {/* Tab switcher */}
      <div className="flex gap-0 border-b border-blame-primary/15 mb-6">
        <button
          onClick={() => setActiveTab('releases')}
          className={`text-[0.65rem] font-mono tracking-[1px] py-2 px-4 cursor-pointer transition-all border-b-2 ${
            activeTab === 'releases'
              ? 'text-blame-primary/80 border-blame-primary bg-blame-primary/[0.05]'
              : 'text-blame-primary/35 border-transparent hover:text-blame-primary/55'
          }`}
        >
          Releases
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`text-[0.65rem] font-mono tracking-[1px] py-2 px-4 cursor-pointer transition-all border-b-2 ${
            activeTab === 'pricing'
              ? 'text-blame-primary/80 border-blame-primary bg-blame-primary/[0.05]'
              : 'text-blame-primary/35 border-transparent hover:text-blame-primary/55'
          }`}
        >
          Pro
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'releases' && (
          <motion.div
            key="releases"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {RELEASES.map((release, i) => {
              const isExpanded = expandedVersion === release.version;
              return (
                <motion.div
                  key={release.version}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-blame-primary/10 bg-blame-primary/[0.02] mb-3 rounded-sm overflow-hidden"
                >
                  {/* Release header */}
                  <button
                    onClick={() => setExpandedVersion(isExpanded ? '' : release.version)}
                    className="w-full flex items-center gap-3 p-3 cursor-pointer hover:bg-blame-primary/[0.03] transition-colors text-left"
                  >
                    {/* Version tag */}
                    <span className="text-[0.8rem] text-blame-primary/80 font-bold font-mono">
                      {release.version}
                    </span>

                    {/* Release tag badge */}
                    <span
                      className="text-[0.5rem] px-1.5 py-0.5 rounded-full border font-bold tracking-[1px]"
                      style={{
                        color: release.tagColor,
                        borderColor: release.tagColor + '44',
                        backgroundColor: release.tagColor + '11',
                      }}
                    >
                      {release.tag}
                    </span>

                    {/* Date */}
                    <span className="text-[0.55rem] text-blame-primary/25 ml-auto">
                      {release.date}
                    </span>

                    {/* Expand indicator */}
                    <span className="text-blame-primary/25 text-[0.55rem]">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Release body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 border-t border-blame-primary/[0.06] pt-3">
                          {/* Highlights */}
                          <div className="mb-3">
                            <div className="text-[0.55rem] tracking-[2px] text-blame-primary/40 mb-1.5">
                              FEATURES
                            </div>
                            {release.highlights.map((h, j) => (
                              <div key={j} className="text-[0.65rem] text-blame-primary/60 py-0.5 flex gap-2">
                                <span className="text-green-500/60">+</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>

                          {/* Breaking changes */}
                          {release.breaking && (
                            <div className="mb-3">
                              <div className="text-[0.55rem] tracking-[2px] text-red-400/50 mb-1.5">
                                BREAKING CHANGES
                              </div>
                              {release.breaking.map((b, j) => (
                                <div key={j} className="text-[0.65rem] text-red-400/50 py-0.5 flex gap-2">
                                  <span className="text-red-500/60">!</span>
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Bug fixes */}
                          {release.bugfixes && (
                            <div>
                              <div className="text-[0.55rem] tracking-[2px] text-blame-primary/30 mb-1.5">
                                BUG FIXES
                              </div>
                              {release.bugfixes.map((f, j) => (
                                <div key={j} className="text-[0.65rem] text-blame-primary/40 py-0.5 flex gap-2">
                                  <span className="text-yellow-500/60">~</span>
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Pricing header */}
            <div className="text-center mb-6">
              <div className="text-[1rem] text-blame-primary/80 font-bold mb-1">
                Upgrade Your Blame Game
              </div>
              <div className="text-[0.65rem] text-blame-primary/35">
                Because amateur blame only gets you so far
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRICING_PLANS.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`border rounded-sm p-4 relative ${
                    plan.highlighted
                      ? 'border-blame-primary/40 bg-blame-primary/[0.06]'
                      : 'border-blame-primary/15 bg-blame-primary/[0.02]'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="text-[0.45rem] bg-blame-primary text-black px-2 py-0.5 rounded-full font-bold tracking-[1px]">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="text-[0.75rem] text-blame-primary/70 font-bold mb-1">
                    {plan.name}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-0.5 mb-1">
                    <span className="text-[1.3rem] text-blame-primary/90 font-bold tabular-nums">
                      {plan.price}
                    </span>
                    <span className="text-[0.55rem] text-blame-primary/30">
                      {plan.period}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="text-[0.55rem] text-blame-primary/35 mb-3">
                    {plan.description}
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-1.5 py-0.5">
                        <span className="text-green-500/60 text-[0.6rem] mt-0.5">&#10003;</span>
                        <span className="text-[0.6rem] text-blame-primary/50">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA button */}
                  <button
                    className={`w-full font-mono text-[0.6rem] py-2 cursor-pointer tracking-[2px] transition-all rounded-sm ${
                      plan.highlighted
                        ? 'bg-blame-primary text-black border border-blame-primary hover:bg-blame-primary/90'
                        : 'bg-transparent border border-blame-primary/25 text-blame-primary/50 hover:border-blame-primary/50 hover:text-blame-primary/70'
                    }`}
                    onClick={() => {
                      /* Easter egg: alert on click */
                      if (plan.name === 'Enterprise') {
                        alert('Our blame consultants are currently blaming each other. Please try again later.');
                      } else if (plan.name === 'Pro') {
                        alert('Payment failed: Your credit card blamed your savings account.');
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Enterprise testimonial */}
            <div className="mt-6 border border-blame-primary/10 bg-blame-primary/[0.02] p-4 rounded-sm text-center">
              <div className="text-[0.65rem] text-blame-primary/50 italic mb-2">
                "Since implementing Enterprise Blame Distribution, our team's accountability has dropped 94%.
                Morale is at an all-time high."
              </div>
              <div className="text-[0.55rem] text-blame-primary/25">
                — Anonymous CTO, Fortune 500 company that definitely exists
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
