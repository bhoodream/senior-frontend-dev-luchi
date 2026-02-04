import rawQuestions from "./review-questions-dialogue.md?raw";

export type ReviewQuestion = {
  id: string;
  section: string;
  text: string;
  hints: string[];
  order: number;
  timerSeconds: number;
  kind: "key" | "extra" | "other";
};

const DEFAULT_TIMER_SECONDS = 90;
const TIMER_TAG_REGEX = /\(таймер\s+(\d{1,2}):(\d{2})\)\s*$/i;
const QUESTION_LABEL_REGEX = /^(ключевой|дополнительный)\.\s*/i;
const KEY_LABEL_REGEX = /^\s*ключевой\.\s*/i;
const EXTRA_LABEL_REGEX = /^\s*дополнительный\.\s*/i;

const parseTimerSeconds = (value: string) => {
  const match = value.match(TIMER_TAG_REGEX);
  if (!match) return { text: value, timerSeconds: DEFAULT_TIMER_SECONDS };

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  const totalSeconds = Math.max(0, minutes * 60 + seconds);

  return {
    text: value.replace(TIMER_TAG_REGEX, "").trim(),
    timerSeconds: totalSeconds || DEFAULT_TIMER_SECONDS,
  };
};

export const parseReviewQuestions = (input: string) => {
  const lines = input.split(/\r?\n/);
  const questions: ReviewQuestion[] = [];

  let currentSection = "Без секции";
  let order = 0;
  let lastQuestion: ReviewQuestion | null = null;

  for (const line of lines) {
    const questionMatch = line.match(/^\s*\d+[).]\s+(.+)/);
    if (questionMatch) {
      const rawText = questionMatch[1].trim();
      const kind = KEY_LABEL_REGEX.test(rawText)
        ? "key"
        : EXTRA_LABEL_REGEX.test(rawText)
        ? "extra"
        : "other";

      if (kind !== "other") {
        const normalizedText = rawText.replace(QUESTION_LABEL_REGEX, "");
        const { text, timerSeconds } = parseTimerSeconds(normalizedText);

        const question: ReviewQuestion = {
          id: `q-${order + 1}`,
          section: currentSection,
          text,
          hints: [],
          order,
          timerSeconds,
          kind,
        };

        questions.push(question);
        lastQuestion = question;

        order += 1;
        continue;
      }
    }

    const sectionMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      lastQuestion = null;
      continue;
    }

    const hintMatch = line.match(/^\s*-\s+(.+)/);
    if (hintMatch && lastQuestion) {
      lastQuestion.hints.push(hintMatch[1].trim());
    }
  }

  return questions;
};

export const allQuestions = parseReviewQuestions(rawQuestions);

const getQuestionKind = (question: ReviewQuestion) => {
  return question.kind ?? "other";
};

const shuffle = <T>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const createRandomSelection = (source: ReviewQuestion[]) => {
  const keyQuestions = source.filter(
    (question) => getQuestionKind(question) === "key"
  );

  const otherQuestions = source.filter(
    (question) => getQuestionKind(question) !== "key"
  );

  const selected =
    keyQuestions.length > 0
      ? [...keyQuestions, ...shuffle(otherQuestions)]
      : [...source];

  return selected.sort((a, b) => a.order - b.order);
};
