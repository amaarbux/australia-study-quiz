import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import quizData from '../../data/quiz-data.json';

type Outcome = {
  title: string;
  image: string;
  charImage?: string;
  traits: string[];
  description: string;
  personality: string;
  baseCamp: string;
  luckyCharm: string;
  partner: string;
};

export default function ResultPage() {
  const router = useRouter();
  const { outcomeId } = router.query;
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  useEffect(() => {
    if (outcomeId) {
      const o = (quizData.outcomes as Record<string, Outcome>)[outcomeId as string];
      if (o) setOutcome(o);
    }
  }, [outcomeId]);

  if (!outcome) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I'm a ${outcome.title}!`,
          text: `I got ${outcome.title} on the Australia Study Quiz! Find out where you belong!`,
          url: window.location.origin,
        });
      } catch { }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2C3E50' }}>
      <div className="w-full max-w-[390px] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col h-[100dvh] sm:h-[844px] sm:max-h-[92vh]">

        {/* Scrollable result image */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {/* The baked-in buttons at the bottom of the image are cropped off here.
              Make the number BIGGER (e.g. -160px) to chop MORE off the bottom,
              SMALLER (e.g. -80px) to chop less. Nudge it until the duplicate
              Share/Back/Retry from the image just disappears. */}
          <div style={{ overflow: 'hidden' }}>
            <img
              src={outcome.image}
              alt={outcome.title}
              className="w-full block"
              style={{ marginBottom: '-120px' }}
            />
          </div>
        </div>

        {/* Functional buttons — pinned at the bottom, always visible */}
        <div className="flex justify-center gap-8 py-6 shrink-0" style={{ backgroundColor: '#F5EDE0' }}>
          <button onClick={handleShare} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A6B8A' }}>
              <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </div>
            <span className="text-xs font-bold" style={{ color: '#4A6B8A' }}>Share</span>
          </button>

          <button onClick={() => router.back()} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A6B8A' }}>
              <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </div>
            <span className="text-xs font-bold" style={{ color: '#4A6B8A' }}>Back</span>
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem('asqAnswers');
              router.push('/');
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A6B8A' }}>
              <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            </div>
            <span className="text-xs font-bold" style={{ color: '#4A6B8A' }}>Retry</span>
          </button>
        </div>
      </div>
    </div>
  );
}