import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import rawQuizData from '../../data/quiz-data.json';

// Shared shapes for the quiz JSON. Options can carry optional image fields
// (swipe-card, character-select and image-grid use them; text-select does not),
// so they are typed as optional to satisfy the production type-check.
type QuizOption = {
  label: string;
  value: string;
  image?: string;
  cardImage?: string;
};

type QuizQuestion = {
  id: string;
  type: string;
  question: string;
  options: QuizOption[];
  image?: string;
  backgroundStyle?: string;
};

type QuizData = {
  questions: QuizQuestion[];
  outcomes: unknown;
  outcomeLogic: unknown;
};

const quizData = rawQuizData as unknown as QuizData;

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
    setSelected(null);
    setCardIndex(0);
    setAnimKey(prev => prev + 1);
  }, [id]);

  if (!question) return null;

  // Guard against a stale `selected`/`cardIndex` carried over from a previous
  // question that had more options than the current one. Without this, reading
  // question.options[selected] can be undefined and crash the page.
  const optionCount = question.options.length;
  const safeSelected =
    selected !== null && selected < optionCount ? selected : null;
  const safeCardIndex = cardIndex < optionCount ? cardIndex : 0;

  const handleConfirm = () => {
    if (selected === null || selected >= question.options.length) return;

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

  // Determine background based on question
  const getBg = () => {
    const style = question.backgroundStyle;
    if (style === 'orange-gradient') return 'linear-gradient(180deg, #D4813B 0%, #B86730 100%)';
    if (style === 'orange-warm') return 'linear-gradient(180deg, #C47535 0%, #A85E28 100%)';
    if (style === 'cream') return 'linear-gradient(180deg, #E8D5B7 0%, #D4C0A0 100%)';
    if (style === 'navy') return 'linear-gradient(180deg, #2D3E50 0%, #1A2A3A 100%)';
    return '#2D3E50';
  };

  const isTextOnCream = question.backgroundStyle === 'cream';
  const textColor = isTextOnCream ? '#2D3E50' : '#E8D5B7';

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2C3E50' }}>
      <div
        className="w-full max-w-[390px] min-h-screen sm:min-h-0 sm:h-[844px] sm:rounded-[40px] sm:shadow-2xl overflow-y-auto overflow-x-hidden relative flex flex-col no-scrollbar"
        style={{ background: getBg() }}
        key={animKey}
      >
        <div className="flex flex-col items-center px-6 pt-6 pb-6 flex-1">

          {/* Question text */}
          <h2
            className="text-xl font-bold text-center mb-4 animate-fadeIn font-display"
            style={{ color: textColor }}
          >
            {question.question}
          </h2>

          {/* === SWIPE CARD TYPE === */}
          {question.type === 'swipe-card' && (
            <div className="flex-1 flex flex-col items-center w-full animate-scaleIn">
              {/* Card display */}
              <div className="w-full flex justify-center mb-4 relative" style={{ minHeight: 340 }}>
                <img
                  src={question.options[safeCardIndex].image}
                  alt={question.options[safeCardIndex].label}
                  className="w-[280px] rounded-2xl shadow-lg"
                  style={{ border: selected === cardIndex ? '4px solid #CF863C' : '4px solid transparent' }}
                />
              </div>

              {/* Dot indicators */}
              <div className="flex gap-2 mb-3">
                {question.options.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCardIndex(i); setSelected(i); }}
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{ backgroundColor: safeCardIndex === i ? '#CF863C' : '#4A6B8A' }}
                  />
                ))}
              </div>

              {/* Arrow navigation */}
              <div className="flex items-center gap-6 mb-4">
                <button
                  onClick={() => {
                    const prev = safeCardIndex > 0 ? safeCardIndex - 1 : question.options.length - 1;
                    setCardIndex(prev);
                    setSelected(prev);
                  }}
                  className="text-2xl px-3 py-1 rounded-lg"
                  style={{ color: '#E8D5B7' }}
                >
                  ◀
                </button>
                <span className="text-sm font-bold" style={{ color: '#E8D5B7' }}>
                  {question.options[safeCardIndex].label}
                </span>
                <button
                  onClick={() => {
                    const next = safeCardIndex < question.options.length - 1 ? safeCardIndex + 1 : 0;
                    setCardIndex(next);
                    setSelected(next);
                  }}
                  className="text-2xl px-3 py-1 rounded-lg"
                  style={{ color: '#E8D5B7' }}
                >
                  ▶
                </button>
              </div>
            </div>
          )}

          {/* === CHARACTER SELECT TYPE === */}
          {question.type === 'character-select' && (
            <div className="flex-1 flex flex-col items-center w-full">
              {/* Thumbnail row */}
              <div className="flex gap-3 mb-6 animate-fadeIn">
                {question.options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`character-thumb ${selected === i ? 'selected' : ''}`}
                    style={{ backgroundColor: '#3A5068' }}
                  >
                    <img src={opt.image} alt={opt.label} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Selected character display */}
              {safeSelected !== null && (
                <div className="flex flex-col items-center animate-scaleIn">
                  <img
                    src={question.options[safeSelected].image}
                    alt={question.options[safeSelected].label}
                    className="w-52 h-52 object-contain mb-3"
                  />
                  <h3 className="font-display text-2xl" style={{ color: '#E8D5B7' }}>
                    {question.options[safeSelected].label}
                  </h3>
                </div>
              )}

              {safeSelected === null && (
                <div className="flex-1 flex items-center">
                  <h3 className="font-display text-2xl" style={{ color: '#E8D5B7' }}>
                    Pick a Character!
                  </h3>
                </div>
              )}
            </div>
          )}

          {/* === TEXT SELECT TYPE === */}
          {question.type === 'text-select' && (
            <div className="flex-1 flex flex-col items-center w-full">
              {/* Optional image */}
              {question.image && (
                <div className="mb-6 animate-scaleIn">
                  <img
                    src={question.image}
                    alt=""
                    className="w-48 h-48 object-contain"
                  />
                </div>
              )}

              {/* Text options */}
              <div className="w-full flex flex-col gap-3 animate-slideUp">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`option-pill ${selected === i ? 'selected' : ''}`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* === IMAGE GRID TYPE === */}
          {question.type === 'image-grid' && (
            <div className="flex-1 flex flex-col items-center w-full">
              <div className="grid grid-cols-2 gap-3 w-full animate-fadeIn">
                {question.options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`image-option flex flex-col items-center ${selected === i ? 'selected' : ''}`}
                  >
                    <img
                      src={opt.image || ''}
                      alt={opt.label}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <span
                      className="text-sm font-bold mt-2 text-center"
                      style={{ color: textColor }}
                    >
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Confirm button */}
          <div className="w-full flex flex-col items-center mt-4 animate-fadeIn delay-300">
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className={`btn-confirm w-full max-w-[280px] ${selected !== null ? 'active' : ''}`}
            >
              Confirm
            </button>
            <button
              onClick={handleBack}
              className="mt-3 text-sm font-bold transition-opacity hover:opacity-80"
              style={{ color: '#CF863C' }}
            >
              I Changed my mind!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}