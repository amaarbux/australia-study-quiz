import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import quizData from '../data/quiz-data.json';

export default function LoadingPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [subText, setSubText] = useState(false);
  const [outcomeId, setOutcomeId] = useState('dynamic-explorer');

  useEffect(() => {
    const saved = sessionStorage.getItem('asqAnswers');
    const answers: Record<string, string> = saved ? JSON.parse(saved) : {};

    const basecamp = answers['basecamp'] || 'big-creative';
    const funStudies = answers['fun-studies'] || 'balanced';
    const key = `${basecamp}+${funStudies}`;
    const logic = quizData.outcomeLogic as Record<string, string>;
    const result = logic[key] || logic['default'];
    setOutcomeId(result);

    const t1 = setTimeout(() => setSubText(true), 1500);
    const t2 = setTimeout(() => setShowButton(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleClick = async () => {
    try {
      const saved = sessionStorage.getItem('asqAnswers');
      const answers: Record<string, string> = saved ? JSON.parse(saved) : {};

      const now = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      const docId =
        `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}` +
        `_${p(now.getHours())}-${p(now.getMinutes())}-${p(now.getSeconds())}-${String(now.getMilliseconds()).padStart(3, '0')}`;

      await setDoc(doc(db, 'quiz_results', docId), {
        answers,
        outcome: outcomeId,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error saving to Firestore:', e);
    }

    router.push(`/result/${outcomeId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2C3E50' }}>
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-0 sm:h-[844px] sm:max-h-[92vh] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col items-center justify-center loading-gradient px-8 text-center">
        <h1 className="font-display text-4xl mb-4" style={{ color: '#2D3E50' }}>
          Gathering results...
        </h1>
        {subText && (
          <p className="text-lg mb-12" style={{ color: '#4A6B8A' }}>
            I wonder where you will go?
          </p>
        )}
        {showButton && (
          <button onClick={handleClick}
            className="px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105"
            style={{ backgroundColor: '#CF863C', color: 'white' }}>
            Click to Find out!
          </button>
        )}
      </div>
    </div>
  );
}