import type { Difficulty } from '@/types/game';

export type Mode = 'solo' | 'versus';
export type ColorKey = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface CourseCardSeed {
  word: string;
  inkColor: ColorKey;
}

export interface CourseDefinition {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  cardsCount: number;
  timePerCard: number;
  vibe: string;
  accent: string;
  colors: ColorKey[];
  cards: CourseCardSeed[];
}

export interface SavedPlayerProfile {
  id: string;
  name: string;
  email: string;
}

export interface SavedSessionConfig {
  id: string;
  createdAt: string;
  joinedAsPlayerId: string;
  ownerId?: string;
}

export interface MatchSummary {
  id: string;
  courseId: string;
  courseName: string;
  difficulty: Difficulty;
  mode: Mode;
  playedAt: string;
  totalCards: number;
  standings: Array<{
    playerId: string;
    playerName: string;
    score: number;
    averageReactionTime: number;
    accuracy: number;
    isBot?: boolean;
  }>;
}

export const COLOR_LABELS: Record<ColorKey, string> = {
  red: 'Красный',
  blue: 'Синий',
  green: 'Зелёный',
  yellow: 'Жёлтый',
  purple: 'Фиолетовый',
  orange: 'Оранжевый',
};

export const COLOR_HEX: Record<ColorKey, string> = {
  red: '#ff4d6d',
  blue: '#4d96ff',
  green: '#2ec4b6',
  yellow: '#ffbe0b',
  purple: '#9b5de5',
  orange: '#fb8500',
};

const EASY_CARDS: CourseCardSeed[] = [
  { word: 'КРАСНЫЙ', inkColor: 'blue' },
  { word: 'СИНИЙ', inkColor: 'green' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'red' },
  { word: 'КРАСНЫЙ', inkColor: 'green' },
  { word: 'СИНИЙ', inkColor: 'red' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'blue' },
  { word: 'КРАСНЫЙ', inkColor: 'blue' },
  { word: 'СИНИЙ', inkColor: 'green' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'red' },
  { word: 'КРАСНЫЙ', inkColor: 'green' },
];

const MEDIUM_CARDS: CourseCardSeed[] = [
  { word: 'КРАСНЫЙ', inkColor: 'blue' },
  { word: 'СИНИЙ', inkColor: 'green' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'red' },
  { word: 'ЖЁЛТЫЙ', inkColor: 'purple' },
  { word: 'ФИОЛЕТОВЫЙ', inkColor: 'yellow' },
  { word: 'КРАСНЫЙ', inkColor: 'purple' },
  { word: 'СИНИЙ', inkColor: 'yellow' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'blue' },
  { word: 'ЖЁЛТЫЙ', inkColor: 'red' },
  { word: 'ФИОЛЕТОВЫЙ', inkColor: 'green' },
  { word: 'КРАСНЫЙ', inkColor: 'yellow' },
  { word: 'СИНИЙ', inkColor: 'purple' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'yellow' },
  { word: 'ЖЁЛТЫЙ', inkColor: 'green' },
  { word: 'ФИОЛЕТОВЫЙ', inkColor: 'blue' },
];

const HARD_CARDS: CourseCardSeed[] = [
  { word: 'КРАСНЫЙ', inkColor: 'blue' },
  { word: 'СИНИЙ', inkColor: 'green' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'red' },
  { word: 'ЖЁЛТЫЙ', inkColor: 'purple' },
  { word: 'ФИОЛЕТОВЫЙ', inkColor: 'yellow' },
  { word: 'ОРАНЖЕВЫЙ', inkColor: 'purple' },
  { word: 'КРАСНЫЙ', inkColor: 'orange' },
  { word: 'СИНИЙ', inkColor: 'yellow' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'blue' },
  { word: 'ЖЁЛТЫЙ', inkColor: 'red' },
  { word: 'ФИОЛЕТОВЫЙ', inkColor: 'green' },
  { word: 'ОРАНЖЕВЫЙ', inkColor: 'blue' },
  { word: 'КРАСНЫЙ', inkColor: 'yellow' },
  { word: 'СИНИЙ', inkColor: 'purple' },
  { word: 'ЗЕЛЁНЫЙ', inkColor: 'yellow' },
  { word: 'ЖЁЛТЫЙ', inkColor: 'green' },
  { word: 'ФИОЛЕТОВЫЙ', inkColor: 'blue' },
  { word: 'ОРАНЖЕВЫЙ', inkColor: 'red' },
];

export const COURSE_LIBRARY: CourseDefinition[] = [
  {
    id: 'pink-sprint',
    name: 'Pink Sprint',
    description: 'Мягкий вход в тест Струпа: 3 цвета, спокойный темп и упор на точность.',
    difficulty: 'easy',
    cardsCount: 10,
    timePerCard: 5000,
    vibe: 'Новички, разогрев, уверенный старт',
    accent: '#ff4d8d',
    colors: ['red', 'blue', 'green'],
    cards: EASY_CARDS,
  },
  {
    id: 'candy-chaos',
    name: 'Candy Chaos',
    description: 'Пять цветов, больше интерференции и настоящая гонка за скоростью.',
    difficulty: 'medium',
    cardsCount: 15,
    timePerCard: 4000,
    vibe: 'Скорость, хаос, соревновательный темп',
    accent: '#ff78b2',
    colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    cards: MEDIUM_CARDS,
  },
  {
    id: 'diva-overload',
    name: 'Diva Overload',
    description: 'Шесть цветов, минимум времени и высокая когнитивная нагрузка.',
    difficulty: 'hard',
    cardsCount: 18,
    timePerCard: 3000,
    vibe: 'Пиковый стресс и борьба за рейтинг',
    accent: '#ff8fab',
    colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
    cards: HARD_CARDS,
  },
];

export const BOT_NAMES = ['Pixel Vixen', 'Gloss Ghost', 'Neon Mimi'];

export const RULES_COPY = [
  'Нужно нажимать цвет чернил, а не значение слова.',
  'Первый правильный ответ забирает максимальный бонус за скорость.',
  'Неправильный ответ даёт штраф -5 и вызывает помеху у остальных.',
  'Побеждает игрок с максимальным счётом, при равенстве решает средняя реакция.',
];

export const getCourseById = (courseId: string) =>
  COURSE_LIBRARY.find((course) => course.id === courseId) ?? COURSE_LIBRARY[0];

export const createSessionCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
