import { useState, useEffect } from 'react';
import { glitchText } from '../utils/glitch';

const BASE_TITLE = 'GIT BLAME: LIFE';

export default function Header() {
  const [title, setTitle] = useState(BASE_TITLE);

  useEffect(() => {
    const iv = setInterval(() => {
      setTitle(glitchText(BASE_TITLE, 0.12));
      setTimeout(() => setTitle(BASE_TITLE), 120);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="text-center mb-8 border-b border-blame-primary/20 pb-6">
      <div className="text-[0.65rem] tracking-[6px] text-blame-primary/35 mb-2">
        WENDER MEDIA ACCOUNTABILITY AVOIDANCE SUITE
      </div>
      <h1
        className="text-[clamp(1.4rem,5vw,2.5rem)] font-normal m-0 mb-1 tracking-[4px]"
        style={{ textShadow: '0 0 20px #cc44ff, 0 0 40px #cc44ff' }}
      >
        {title}
      </h1>
      <div className="text-[0.7rem] text-blame-primary/55 tracking-[2px]">
        v6.6.6 — IT'S NEVER YOUR FAULT. PROBABLY.
      </div>
      <div className="mt-3 flex justify-center gap-6 text-[0.6rem] text-blame-primary/25 flex-wrap">
        <span>BLAME DRIVEN DEVELOPMENT</span>
        <span>NO SELF-REFLECTION</span>
        <span>100% ACCURATE</span>
        <span>MERCURY AWARE</span>
      </div>
    </div>
  );
}
