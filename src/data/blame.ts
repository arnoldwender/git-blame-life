export interface Culprit {
  name: string;
  email: string;
  ago: string;
}

export interface BlameLine {
  hash: string;
  change: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface BlameLineWithCulprit extends BlameLine {
  culprit: Culprit;
}

export interface BlameSummaryData {
  topCulprit: Culprit;
  totalCommits: number;
  selfBlame: number;
  exBlame: number;
  societyBlame: number;
}

export const CULPRITS: Culprit[] = [
  { name: 'your-ex', email: 'definitely-not-thinking-about@them.com', ago: '847 days ago' },
  { name: 'past-you', email: 'why-did-i@do-that.com', ago: '3 years ago' },
  { name: 'society', email: 'not-my@fault.org', ago: 'centuries ago' },
  { name: 'mercury-retrograde', email: 'planets@not-aligned.space', ago: 'last week' },
  { name: 'your-parents', email: 'blame@upbringing.com', ago: 'decades ago' },
  { name: 'monday', email: 'monday@mondays.mon', ago: 'every week' },
  { name: 'the-algorithm', email: 'feed@attention-economy.com', ago: '2019' },
  { name: 'capitalism', email: 'hustle@grindset.biz', ago: '1776' },
  { name: 'sleep-deprivation', email: '3am@bad-decisions.com', ago: 'last night' },
  { name: 'imposter-syndrome', email: 'youre-a-fraud@internalized.dev', ago: 'always' },
  { name: 'undefined-behavior', email: 'null@undefined.js', ago: 'runtime' },
  { name: 'that-one-coworker', email: 'you-know-who@work.slack', ago: 'yesterday' },
];

export const BLAME_LINES: BlameLine[] = [
  { hash: 'a1b2c3d', change: 'introduced trust issues', severity: 'critical' },
  { hash: 'e4f5g6h', change: 'removed work-life balance', severity: 'high' },
  { hash: 'i7j8k9l', change: 'deprecated sleep schedule', severity: 'critical' },
  { hash: 'm1n2o3p', change: 'merged anxiety into main', severity: 'critical' },
  { hash: 'q4r5s6t', change: 'pushed unreviewed life decisions', severity: 'high' },
  { hash: 'u7v8w9x', change: 'deleted self-confidence branch', severity: 'critical' },
  { hash: 'y1z2a3b', change: 'force-pushed bad habits', severity: 'high' },
  { hash: 'c4d5e6f', change: 'reverted happiness to v0.1', severity: 'medium' },
  { hash: 'g7h8i9j', change: 'committed without thinking', severity: 'medium' },
  { hash: 'k1l2m3n', change: 'broke the build on Friday', severity: 'critical' },
  { hash: 'o4p5q6r', change: 'squashed important feelings', severity: 'high' },
  { hash: 's7t8u9v', change: 'added unnecessary complexity', severity: 'medium' },
];

export const PROBLEMS: string[] = [
  'my life in general',
  "why I'm always tired",
  'my financial situation',
  "why I can't focus",
  'my relationship issues',
  'why I procrastinate',
  'my career choices',
  'why Mondays exist',
  'my sleep schedule',
  'why I have trust issues',
];

export const TERMINAL_LOGS: string[] = [
  'Initializing blame algorithm...',
  'Scanning commit history of your life...',
  'Cross-referencing with your bad decisions database...',
  'Consulting Mercury retrograde calendar...',
  'Analyzing childhood trauma index...',
  'Running social media influence audit...',
  'Calculating blame distribution...',
  'WARNING: High levels of self-blame detected',
  'Blame report ready. You won\'t like this.',
];
