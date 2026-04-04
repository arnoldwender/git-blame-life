import { PROBLEMS } from '../data/blame';

interface BlameInputProps {
  input: string;
  setInput: (val: string) => void;
  onBlame: () => void;
  isBlaming: boolean;
}

export default function BlameInput({
  input,
  setInput,
  onBlame,
  isBlaming,
}: BlameInputProps) {
  return (
    <div className="mb-6">
      <div className="text-[0.62rem] tracking-[3px] text-blame-primary/55 mb-2">
        WHAT DO YOU WANT TO BLAME?
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {PROBLEMS.map((p, i) => (
          <span
            key={i}
            onClick={() => setInput(p)}
            className="text-[0.58rem] border border-blame-primary/20 py-1 px-2 text-blame-primary/50 transition-all duration-150 cursor-pointer hover:bg-blame-primary/[0.08] hover:text-blame-primary/70 hover:border-blame-primary/40"
          >
            {p}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blame-primary">
            $
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onBlame()}
            placeholder='git blame "my life choices"'
            className="w-full bg-blame-dark border border-blame-primary/25 text-blame-primary font-mono text-[0.85rem] py-3 pr-3 pl-8 outline-none placeholder:text-blame-primary/25 focus:border-blame-primary/50 transition-colors"
            style={{ caretColor: '#cc44ff' }}
          />
        </div>
        <button
          onClick={onBlame}
          disabled={isBlaming}
          className="bg-transparent border border-blame-primary text-blame-primary font-mono text-[0.8rem] py-3 px-5 cursor-pointer tracking-[2px] transition-all duration-200 hover:bg-blame-primary hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-blame-primary"
        >
          {isBlaming ? 'BLAMING...' : 'GIT BLAME'}
        </button>
      </div>
    </div>
  );
}
