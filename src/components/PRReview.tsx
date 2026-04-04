/**
 * PRReview — Fake pull request review comments on your life decision.
 * Different "reviewers" give humorous feedback.
 */
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCommitSound } from '../utils/sound';

interface ReviewComment {
  reviewer: string;
  avatar: string;
  status: 'approved' | 'changes_requested' | 'commented';
  statusLabel: string;
  comment: string;
  timeAgo: string;
}

interface ReviewSet {
  decision: string;
  comments: ReviewComment[];
}

const REVIEW_SETS: ReviewSet[] = [
  {
    decision: 'Quitting my stable job to "find myself"',
    comments: [
      { reviewer: 'Mom', avatar: '👩', status: 'approved', statusLabel: 'LGTM', comment: 'I support whatever makes you happy sweetie! Also I made lasagna, come home.', timeAgo: '2 hours ago' },
      { reviewer: 'Dad', avatar: '👨', status: 'changes_requested', statusLabel: 'Needs changes', comment: 'Have you considered... not doing this? When I was your age I had a house, a car, and a 401k. Just saying.', timeAgo: '1 hour ago' },
      { reviewer: 'Bank Account', avatar: '🏦', status: 'changes_requested', statusLabel: 'Request changes', comment: 'DENIED. Insufficient funds for "finding yourself." May I suggest finding a second job instead?', timeAgo: '45 min ago' },
      { reviewer: 'Therapist', avatar: '🧠', status: 'approved', statusLabel: 'Approved with concerns', comment: 'This is a breakthrough! Also our next session is $200 and you should probably book more.', timeAgo: '30 min ago' },
      { reviewer: 'LinkedIn', avatar: '💼', status: 'commented', statusLabel: 'Commented', comment: 'Excited to announce that I am OPEN TO OPPORTUNITIES! #hustle #grindset #unemployed', timeAgo: '15 min ago' },
    ],
  },
  {
    decision: 'Getting a gym membership on January 1st',
    comments: [
      { reviewer: 'Mom', avatar: '👩', status: 'approved', statusLabel: 'LGTM', comment: 'So proud of you! I bought you new gym clothes. They still have the tags from last year.', timeAgo: '3 hours ago' },
      { reviewer: 'Past Self', avatar: '👻', status: 'commented', statusLabel: 'Commented', comment: 'LOL. See you at the cancellation desk in February. I left a Snickers in your gym bag.', timeAgo: '2 hours ago' },
      { reviewer: 'Bank Account', avatar: '🏦', status: 'changes_requested', statusLabel: 'Request changes', comment: '$49.99/month for a $3,000/year coat rack membership? The park is free.', timeAgo: '1 hour ago' },
      { reviewer: 'Couch', avatar: '🛋️', status: 'changes_requested', statusLabel: 'Request changes', comment: 'I thought what we had was special. You\'ll be back. They always come back.', timeAgo: '45 min ago' },
      { reviewer: 'Netflix', avatar: '📺', status: 'commented', statusLabel: 'Commented', comment: 'New season of your favorite show drops next week. Just saying.', timeAgo: '30 min ago' },
    ],
  },
  {
    decision: 'Adopting a "minimalist lifestyle"',
    comments: [
      { reviewer: 'Amazon', avatar: '📦', status: 'changes_requested', statusLabel: 'Request changes', comment: 'Your order history says otherwise. Also, your cart has 23 items. Should I proceed?', timeAgo: '4 hours ago' },
      { reviewer: 'Mom', avatar: '👩', status: 'commented', statusLabel: 'Commented', comment: 'So you don\'t want the 47 Tupperware containers I saved for you?', timeAgo: '3 hours ago' },
      { reviewer: 'IKEA', avatar: '🪑', status: 'changes_requested', statusLabel: 'Request changes', comment: 'We see you bookmarked the KALLAX shelf in 3 colors. Minimalism is a spectrum.', timeAgo: '2 hours ago' },
      { reviewer: 'Closet', avatar: '👔', status: 'commented', statusLabel: 'Commented', comment: 'You own 14 black t-shirts and call it a "capsule wardrobe." Respect, honestly.', timeAgo: '1 hour ago' },
      { reviewer: 'Therapist', avatar: '🧠', status: 'approved', statusLabel: 'Approved', comment: 'The desire to control your environment is valid. That\'ll be $200.', timeAgo: '30 min ago' },
    ],
  },
  {
    decision: 'Starting to learn a new language at 30',
    comments: [
      { reviewer: 'Duolingo Owl', avatar: '🦉', status: 'changes_requested', statusLabel: 'Request changes', comment: 'Your 847-day streak died. I know where you live. Practice or else.', timeAgo: '5 hours ago' },
      { reviewer: 'Dad', avatar: '👨', status: 'commented', statusLabel: 'Commented', comment: 'When I was your age we just pointed at things and spoke louder.', timeAgo: '3 hours ago' },
      { reviewer: 'Brain', avatar: '🧠', status: 'changes_requested', statusLabel: 'Request changes', comment: 'Sorry, memory allocation full. I\'m still storing every embarrassing thing from 2007. No room.', timeAgo: '2 hours ago' },
      { reviewer: 'Google Translate', avatar: '🌐', status: 'approved', statusLabel: 'LGTM', comment: 'Just use me lol. I\'m faster and I don\'t judge your pronunciation.', timeAgo: '1 hour ago' },
      { reviewer: 'Mom', avatar: '👩', status: 'approved', statusLabel: 'Approved', comment: 'Beautiful! Say something in French! ...that was Spanish? Oh, same thing!', timeAgo: '30 min ago' },
    ],
  },
];

interface PRReviewProps {
  decision?: string;
}

export default function PRReview({ decision }: PRReviewProps) {
  const reviewSet = useMemo(() => {
    if (decision) {
      /* Try to match or pick random */
      return REVIEW_SETS[Math.floor(Math.random() * REVIEW_SETS.length)];
    }
    return REVIEW_SETS[Math.floor(Math.random() * REVIEW_SETS.length)];
  }, [decision]);

  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);

  const startReview = useCallback(() => {
    if (started) return;
    setStarted(true);
    setVisibleCount(0);

    reviewSet.comments.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCount(i + 1);
        playCommitSound();
      }, (i + 1) * 800);
    });
  }, [started, reviewSet]);

  const statusColors: Record<string, string> = {
    approved: '#22c55e',
    changes_requested: '#ef4444',
    commented: '#a855f7',
  };

  return (
    <div className="mb-8">
      <div className="text-[0.62rem] tracking-[4px] text-blame-primary/50 mb-4">
        PR REVIEW — YOUR LIFE DECISIONS:
      </div>

      {!started ? (
        <button
          onClick={startReview}
          className="w-full bg-transparent border border-blame-primary/25 text-blame-primary/50 font-mono text-[0.7rem] py-3 cursor-pointer tracking-[2px] transition-all hover:bg-blame-primary/[0.06] hover:border-blame-primary/50 hover:text-blame-primary/70"
        >
          OPEN PULL REQUEST FOR REVIEW
        </button>
      ) : (
        <div className="border border-blame-primary/15 bg-blame-primary/[0.02]">
          {/* PR header */}
          <div className="border-b border-blame-primary/10 p-3">
            <div className="text-[0.75rem] text-blame-primary/80 mb-1">
              PR #{Math.floor(Math.random() * 9000) + 1000}: {reviewSet.decision}
            </div>
            <div className="flex gap-3 text-[0.55rem] text-blame-primary/30">
              <span>feat/questionable-choices → main</span>
              <span>{reviewSet.comments.length} reviewers</span>
            </div>
          </div>

          {/* Comments */}
          <div className="p-3">
            <AnimatePresence>
              {reviewSet.comments.slice(0, visibleCount).map((comment, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 mb-4 last:mb-0"
                >
                  {/* Avatar */}
                  <div className="text-xl flex-shrink-0 mt-0.5">
                    {comment.avatar}
                  </div>

                  {/* Comment body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[0.65rem] text-blame-primary/70 font-bold">
                        {comment.reviewer}
                      </span>
                      <span
                        className="text-[0.5rem] px-1.5 py-0.5 rounded-sm border"
                        style={{
                          color: statusColors[comment.status],
                          borderColor: statusColors[comment.status] + '44',
                          backgroundColor: statusColors[comment.status] + '11',
                        }}
                      >
                        {comment.statusLabel}
                      </span>
                      <span className="text-[0.5rem] text-blame-primary/20 ml-auto">
                        {comment.timeAgo}
                      </span>
                    </div>
                    <div className="text-[0.65rem] text-blame-primary/55 leading-relaxed">
                      {comment.comment}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
