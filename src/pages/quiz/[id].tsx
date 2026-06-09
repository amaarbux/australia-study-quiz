import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import quizData from '../../data/quiz-data.json';

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [cardIndex, setCardIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const questionIdx = parseInt(id as string);
  const question = quizData.questions[questionIdx];
  const totalQuestions = quizData.questions.length;

  useEffect(() => {
    const saved = sessionStorage.getItem('asqAnswers');
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setCardIndex(0);
    setAnimKey(prev => prev + 1);
    const q = quizData.questions[parseInt(id as string)];
    if (q && q.type === 'swipe-card') {
      setSelected(0);
    } else {
      setSelected(null);
    }
  }, [id]);

  if (!question) return null;

  const handleConfirm = () => {
    if (selected === null) return;
    const option = question.options[selected];
    const newAnswers = { ...answers, [question.id]: option.value };
    setAnswers(newAnswers);
    sessionStorage.setItem('asqAnswers', JSON.stringify(newAnswers));
    if (questionIdx < totalQuestions - 1) {
      router.push(`/quiz/${questionIdx + 1}`);
    } else {
      router.push('/loading');
    }
  };

  const handleBack = () => {
    if (questionIdx > 0) {
      router.push(`/quiz/${questionIdx - 1}`);
    } else {
      router.push('/');
    }
  };

  const getBg = () => {
    const s = (question as any).backgroundStyle;
    if (s === 'orange-gradient') return 'linear-gradient(180deg, #D4813B 0%, #B86730 100%)';
    if (s === 'orange-warm') return 'linear-gradient(180deg, #C47535 0%, #A85E28 100%)';
    if (s === 'cream') return 'linear-gradient(180deg, #E8D5B7 0%, #D4C0A0 100%)';
    if (s === 'navy') return 'linear-gradient(180deg, #2D3E50 0%, #1A2A3A 100%)';
    return '#2D3E50';
  };

  const isTextOnCream = (question as any).backgroundStyle === 'cream';
  const textColor = isTextOnCream ? '#2D3E50' : '#E8D5B7';
  const selectedOption = selected !== null ? question.options[selected] : null;

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ backgroundColor: '#2C3E50' }}>
      <div
        className="w-full max-w-[430px] flex flex-col"
        style={{ background: getBg(), minHeight: '100vh' }}
        key={animKey}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-3 text-center shrink-0">
          <h2 className="text-lg font-bold font-display leading-tight" style={{ color: textColor }}>
            {question.question}
          </h2>
          <p className="text-xs mt-1 opacity-60" style={{ color: textColor }}>{question.hint}</p>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-2">

          {/* SWIPE CARD */}
          {question.type === 'swipe-card' && (
            <div className="flex flex-col items-center w-full">
              <div
                className="flex items-center justify-center w-full cursor-pointer mb-3"
                onClick={() => setSelected(cardIndex)}
              >
                <img
                  src={question.options[cardIndex].image}
                  alt={question.options[cardIndex].label}
                  className="rounded-2xl shadow-xl"
                  style={{
                    border: '4px solid #CF863C',
                    maxHeight: '52vh',
                    width: 'auto',
                    maxWidth: '75%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div className="flex gap-1.5 mb-2">
                {question.options.map((_, i) => (
                  <button key={i} onClick={() => { setCardIndex(i); setSelected(i); }}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ backgroundColor: cardIndex === i ? '#CF863C' : 'rgba(255,255,255,0.3)' }} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { const p = cardIndex > 0 ? cardIndex - 1 : question.options.length - 1; setCardIndex(p); setSelected(p); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ color: '#E8D5B7', backgroundColor: 'rgba(255,255,255,0.15)' }}
                >◀</button>
                <span className="text-sm font-bold min-w-[140px] text-center" style={{ color: '#E8D5B7' }}>
                  {question.options[cardIndex].label}
                </span>
                <button
                  onClick={() => { const n = cardIndex < question.options.length - 1 ? cardIndex + 1 : 0; setCardIndex(n); setSelected(n); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ color: '#E8D5B7', backgroundColor: 'rgba(255,255,255,0.15)' }}
                >▶</button>
              </div>
            </div>
          )}

          {/* CHARACTER SELECT */}
          {question.type === 'character-select' && (
            <div className="flex flex-col items-center w-full">
              <div className="flex gap-3 mb-5">
                {question.options.map((opt, i) => (
                  <div key={i} onClick={() => setSelected(i)}
                    className="w-14 h-14 rounded-xl overflow-hidden cursor-pointer transition-all"
                    style={{
                      border: selected === i ? '3px solid #CF863C' : '3px solid rgba(255,255,255,0.2)',
                      backgroundColor: '#3A5068',
                      boxShadow: selected === i ? '0 0 12px rgba(207,134,60,0.5)' : 'none',
                      transform: selected === i ? 'scale(1.1)' : 'scale(1)',
                    }}>
                    <img src={opt.image} alt={opt.label} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {selectedOption ? (
                <div className="flex flex-col items-center">
                  <img src={selectedOption.image} alt={selectedOption.label}
                    className="object-contain mb-3" style={{ maxHeight: '42vh' }} />
                  <h3 className="font-display text-xl" style={{ color: '#E8D5B7' }}>
                    {selectedOption.label}
                  </h3>
                </div>
              ) : (
                <div className="py-20 flex items-center justify-center">
                  <h3 className="font-display text-xl" style={{ color: '#E8D5B7' }}>Pick a Character!</h3>
                </div>
              )}
            </div>
          )}

          {/* TEXT SELECT */}
          {question.type === 'text-select' && (
            <div className="flex flex-col items-center w-full">
              {(question as any).image && (
                <img src={(question as any).image} alt="" className="h-36 object-contain mb-5" />
              )}
              <div className="w-full flex flex-col gap-3">
                {question.options.map((opt, i) => (
                  <button key={i} onClick={() => setSelected(i)}
                    className="w-full py-3 px-5 rounded-xl font-bold text-sm transition-all"
                    style={{
                      backgroundColor: selected === i ? '#A85E28' : '#CF863C',
                      color: 'white',
                      border: selected === i ? '2px solid white' : '2px solid rgba(255,255,255,0.15)',
                      boxShadow: selected === i ? '0 0 15px rgba(255,255,255,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                      transform: selected === i ? 'scale(1.02)' : 'scale(1)',
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* IMAGE GRID */}
          {question.type === 'image-grid' && (
            <div className="grid grid-cols-2 gap-3 w-full">
              {question.options.map((opt, i) => (
                <div key={i} onClick={() => setSelected(i)}
                  className="flex flex-col items-center cursor-pointer transition-all rounded-xl p-3"
                  style={{
                    backgroundColor: selected === i ? 'rgba(207,134,60,0.35)' : 'rgba(255,255,255,0.08)',
                    border: selected === i ? '3px solid #CF863C' : '3px solid rgba(255,255,255,0.1)',
                    boxShadow: selected === i ? '0 0 15px rgba(207,134,60,0.3)' : 'none',
                    transform: selected === i ? 'scale(1.03)' : 'scale(1)',
                  }}>
                  <img src={opt.image || ''} alt={opt.label} className="w-20 h-20 object-contain mb-1" />
                  <span className="text-xs font-bold text-center leading-tight" style={{ color: textColor }}>
                    {opt.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Single bottom confirm*/}
        <div className="px-6 pb-8 pt-4 flex flex-col items-center shrink-0">
          <button onClick={handleConfirm} disabled={selected === null}
            className="w-full max-w-[260px] py-3 rounded-xl font-bold text-base transition-all"
            style={{
              backgroundColor: selected !== null ? '#CF863C' : '#4A6B8A',
              color: selected !== null ? 'white' : '#8BA4B8',
              opacity: selected !== null ? 1 : 0.5,
              boxShadow: selected !== null ? '0 4px 15px rgba(207,134,60,0.4)' : 'none',
            }}>
            Confirm
          </button>
          <button onClick={handleBack}
            className="mt-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: '#CF863C' }}>
            I Changed my mind!
          </button>
        </div>
      </div>
    </div>
  );
}
