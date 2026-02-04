import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  allQuestions,
  createRandomSelection,
  ReviewQuestion,
} from "./questions";
import "./review-slides.css";

const SELECTION_KEY = "reviewSlidesSelectionV2";
const DEFAULT_TIMER_SECONDS = 300;

const formatSeconds = (total: number) => {
  const clamped = Math.max(0, total);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const loadSelection = () => {
  try {
    const stored = localStorage.getItem(SELECTION_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return null;
    const ids = parsed.filter((id) => typeof id === "string") as string[];
    if (ids.length !== allQuestions.length) return null;
    return ids;
  } catch {
    return null;
  }
};

const storeSelection = (ids: string[]) => {
  localStorage.setItem(SELECTION_KEY, JSON.stringify(ids));
};

const createSelectionIds = () => {
  const selected = createRandomSelection(allQuestions);
  const ids = selected.map((question) => question.id);
  storeSelection(ids);
  return ids;
};

const resolveSelection = (ids: string[]) => {
  const byId = new Map(allQuestions.map((question) => [question.id, question]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as ReviewQuestion[];
};

const clampIndexWithEnd = (index: number, total: number) =>
  Math.min(Math.max(index, 0), Math.max(0, total));

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getVisibleHints = (
  question: ReviewQuestion | undefined,
  secondsLeft: number,
  forcedHints: number
) => {
  if (!question?.hints?.length) return [];
  const totalSeconds = question.timerSeconds ?? DEFAULT_TIMER_SECONDS;
  const elapsed = Math.max(0, totalSeconds - secondsLeft);
  const interval = totalSeconds / (question.hints.length + 1);
  const visibleCount = Math.min(
    question.hints.length,
    Math.floor((elapsed + forcedHints * interval) / interval)
  );
  return question.hints.slice(0, visibleCount);
};

const ReviewSlides = () => {
  const [selectionIds, setSelectionIds] = useState<string[]>(() => {
    return loadSelection() ?? createSelectionIds();
  });
  const [slideMotion, setSlideMotion] = useState<
    "next" | "prev" | "shuffle" | null
  >(null);
  const motionTimerRef = useRef<number | null>(null);

  const selectedQuestions = useMemo(
    () => resolveSelection(selectionIds),
    [selectionIds]
  );

  const [activeIndex, setActiveIndex] = useState(-1);
  const currentQuestion = selectedQuestions[activeIndex];
  const totalQuestions = Math.max(0, selectedQuestions.length);
  const displayedIndex = Math.min(totalQuestions, Math.max(0, activeIndex + 1));
  const totalDurationSeconds = useMemo(
    () =>
      selectedQuestions.reduce(
        (sum, question) =>
          sum + (question.timerSeconds ?? DEFAULT_TIMER_SECONDS),
        0
      ),
    [selectedQuestions]
  );
  const totalDurationMinutes = useMemo(
    () => Math.ceil(totalDurationSeconds / 60),
    [totalDurationSeconds]
  );

  const [secondsLeft, setSecondsLeft] = useState(
    currentQuestion?.timerSeconds ?? DEFAULT_TIMER_SECONDS
  );
  const [forcedHints, setForcedHints] = useState(0);

  const [isStarted, setIsStarted] = useState(false);
  const isFinished =
    isStarted && totalQuestions > 0 && activeIndex >= totalQuestions;
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${(index * 7 + 12) % 100}%`,
        delay: `${(index % 6) * 0.3}s`,
        duration: `${3.2 + (index % 5) * 0.4}s`,
        rotate: `${(index * 37) % 360}deg`,
        colorIndex: index % 5,
      })),
    []
  );

  useEffect(() => {
    if (selectedQuestions.length === 0) {
      const ids = createSelectionIds();
      setSelectionIds(ids);
      return;
    }

    if (isStarted) {
      setActiveIndex((index) =>
        clampIndexWithEnd(index, selectedQuestions.length)
      );
    } else {
      setActiveIndex(-1);
    }
  }, [selectedQuestions.length, isStarted]);

  useEffect(() => {
    if (!currentQuestion) return;
    setSecondsLeft(currentQuestion.timerSeconds ?? DEFAULT_TIMER_SECONDS);
    setForcedHints(0);
  }, [currentQuestion?.id]);

  useEffect(() => {
    if (!currentQuestion || !isStarted) return;
    if (secondsLeft <= 0) return;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [secondsLeft, currentQuestion?.id, isStarted]);

  const triggerMotion = useCallback((motion: "next" | "prev" | "shuffle") => {
    if (motionTimerRef.current) {
      window.clearTimeout(motionTimerRef.current);
    }
    setSlideMotion(motion);
    motionTimerRef.current = window.setTimeout(() => {
      setSlideMotion(null);
    }, 700);
  }, []);

  const goPrev = useCallback(() => {
    if (!isStarted) return;
    triggerMotion("prev");
    setActiveIndex((index) =>
      clampIndexWithEnd(index - 1, selectedQuestions.length)
    );
  }, [selectedQuestions.length, triggerMotion, isStarted]);

  const goNext = useCallback(() => {
    if (!isStarted) return;
    triggerMotion("next");
    setActiveIndex((index) =>
      clampIndexWithEnd(index + 1, selectedQuestions.length)
    );
  }, [selectedQuestions.length, triggerMotion, isStarted]);

  const rebuildSelection = useCallback(() => {
    triggerMotion("shuffle");
    const ids = createSelectionIds();
    setSelectionIds(ids);
    if (isStarted) {
      setActiveIndex(0);
    }
  }, [triggerMotion, isStarted]);

  const startReview = useCallback(() => {
    rebuildSelection();
    setIsStarted(true);
    setActiveIndex(0);
  }, [rebuildSelection]);

  const resetTimer = useCallback(() => {
    if (!currentQuestion) return;
    setSecondsLeft(currentQuestion.timerSeconds ?? DEFAULT_TIMER_SECONDS);
  }, [currentQuestion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isStarted) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          startReview();
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        setForcedHints((prev) =>
          currentQuestion?.hints
            ? clampValue(prev + 1, 0, currentQuestion.hints.length)
            : prev
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, isStarted, startReview]);

  useEffect(() => {
    return () => {
      if (motionTimerRef.current) {
        window.clearTimeout(motionTimerRef.current);
      }
    };
  }, []);

  const resetToIntro = useCallback(() => {
    setIsStarted(false);
    setActiveIndex(-1);
    rebuildSelection();
  }, [rebuildSelection]);

  if (!isStarted) {
    return (
      <div className="slides-page intro-page">
        <main className="slides-main">
          <div className="intro-content">
            <h1 className="intro-title">Senior Frontend Developer ЛУЧИ</h1>
            <p className="intro-description">
              Читываем вопрос (можно про себя) - отвечаем
              <br />
              Время на ответ ограничено: 5 минут
              <br />С течением времени будут появляться наводящие вопросы
            </p>
            <div className="intro-stats">
              <div className="stat-item">
                <span className="stat-value">{selectedQuestions.length}</span>
                <span className="stat-label">Вопросов</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalDurationMinutes}</span>
                <span className="stat-label">Минут</span>
              </div>
            </div>
            <button
              type="button"
              className="start-button"
              onClick={startReview}
            >
              Начать
            </button>
            <p className="intro-hint">Нажмите Space или Enter, чтобы начать</p>
          </div>
        </main>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="slides-page finish-page">
        <header className="slides-header">
          <div className="slides-left">
            <button
              type="button"
              onClick={resetToIntro}
              className="slides-back-btn"
            >
              ← К вступлению
            </button>
          </div>
        </header>
        <main className="slides-main">
          <div className="slides-card-wrap">
            <article className="slide-card stack finish-card">
              <h2 className="finish-title">Теория завершена</h2>
              <p className="finish-text">
                Отличная работа!
                <br />
                Теперь перейдем к практике
              </p>
              <div className="finish-confetti" aria-hidden>
                {confettiPieces.map((piece) => {
                  const style = {
                    "--confetti-left": piece.left,
                    "--confetti-delay": piece.delay,
                    "--confetti-duration": piece.duration,
                    "--confetti-rotate": piece.rotate,
                    "--confetti-color-index": piece.colorIndex,
                  } as CSSProperties;
                  return (
                    <span
                      key={`confetti-${piece.id}`}
                      className="confetti-piece"
                      style={style}
                    />
                  );
                })}
              </div>
            </article>
          </div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="slides-page">
        <div className="slides-header">
          <button
            type="button"
            onClick={resetToIntro}
            className="slides-back-btn"
          >
            ← К вступлению
          </button>
        </div>
        <div
          className={`slide-card stack${
            slideMotion ? ` motion-${slideMotion}` : ""
          }`}
        >
          <p>Вопросы не найдены. Проверьте файл review-questions.md.</p>
          <button type="button" onClick={rebuildSelection}>
            Пересобрать
          </button>
        </div>
      </div>
    );
  }

  const visibleHints = getVisibleHints(
    currentQuestion,
    secondsLeft,
    forcedHints
  );
  const hasMoreHints =
    currentQuestion?.hints &&
    visibleHints.length < currentQuestion.hints.length;

  return (
    <div className="slides-page">
      <header className="slides-header">
        <div className="slides-left">
          <button
            type="button"
            onClick={resetToIntro}
            className="slides-back-btn"
          >
            ← К вступлению
          </button>
        </div>

        <div className="slides-right">
          <div className="slides-timer">{formatSeconds(secondsLeft)}</div>
          <span className="slides-hint">← → для навигации</span>
          <span className="slides-hint">H — подсказка</span>
        </div>
      </header>

      <main className="slides-main">
        <div className="slides-card-wrap">
          <div className="slides-meta">
            <span className="slides-section">{currentQuestion.section}</span>
            <span className="slides-progress">
              Вопрос {displayedIndex} из {totalQuestions}
            </span>
          </div>
          <article
            className={`slide-card stack${
              slideMotion ? ` motion-${slideMotion}` : ""
            }`}
          >
            <p className="slide-question">{currentQuestion.text}</p>
          </article>
          {visibleHints.length > 0 && (
            <div className="slides-hints-orbit" aria-hidden>
              {visibleHints.map((hint, index) => {
                const angle = (index / visibleHints.length) * 360 - 90;
                const style = {
                  "--hint-angle": `${angle}deg`,
                  "--hint-delay": `${index * 140}ms`,
                } as CSSProperties;
                return (
                  <div
                    key={`${currentQuestion.id}-hint-${index}`}
                    className="slides-hint-bubble"
                    style={style}
                  >
                    {hint}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReviewSlides;
