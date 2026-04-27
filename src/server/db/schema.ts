import { pgTable, text, timestamp, integer, boolean, uuid, decimal, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userStatsTable = pgTable('user_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  totalGames: integer('total_games').default(0).notNull(),
  wins: integer('wins').default(0).notNull(),
  losses: integer('losses').default(0).notNull(),
  totalScore: integer('total_score').default(0).notNull(),
  averageScore: decimal('average_score').default('0').notNull(),
  averageReactionTime: decimal('average_reaction_time').default('0').notNull(),
  rating: decimal('rating').default('1000').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const coursesTable = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(), // 'easy', 'medium', 'hard'
  cardsCount: integer('cards_count').notNull(),
  timePerCard: integer('time_per_card').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cardsTable = pgTable('cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull(),
  word: varchar('word', { length: 100 }).notNull(),
  inkColor: varchar('ink_color', { length: 7 }).notNull(), // hex color
  correctAnswer: varchar('correct_answer', { length: 50 }).notNull(), // color name
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  timeLimit: integer('time_limit').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const gameSessionsTable = pgTable('game_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull(),
  ownerUserId: uuid('owner_user_id').notNull(),
  playerCount: integer('player_count').notNull(),
  currentCardIndex: integer('current_card_index').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  finishedAt: timestamp('finished_at'),
});

export const gameAnswersTable = pgTable('game_answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  playerId: uuid('player_id').notNull(),
  cardId: uuid('card_id').notNull(),
  playerAnswer: varchar('player_answer', { length: 50 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  reactionTime: integer('reaction_time').notNull(), // milliseconds
  answerOrder: integer('answer_order').notNull(), // 1st, 2nd, 3rd, 4th
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const gameResultsTable = pgTable('game_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull().unique(),
  playerId: uuid('player_id').notNull(), // winner
  finalScore: integer('final_score').notNull(),
  playerName: varchar('player_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const playerGameStatsTable = pgTable('player_game_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  playerId: uuid('player_id').notNull(),
  finalScore: integer('final_score').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  incorrectAnswers: integer('incorrect_answers').notNull(),
  averageReactionTime: decimal('average_reaction_time').notNull(),
  fastestReactionTime: integer('fastest_reaction_time').notNull(),
  firstAnswers: integer('first_answers').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types
export type User = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;

export type UserStats = InferSelectModel<typeof userStatsTable>;
export type InsertUserStats = InferInsertModel<typeof userStatsTable>;

export type Course = InferSelectModel<typeof coursesTable>;
export type InsertCourse = InferInsertModel<typeof coursesTable>;

export type Card = InferSelectModel<typeof cardsTable>;
export type InsertCard = InferInsertModel<typeof cardsTable>;

export type GameSession = InferSelectModel<typeof gameSessionsTable>;
export type InsertGameSession = InferInsertModel<typeof gameSessionsTable>;

export type GameAnswer = InferSelectModel<typeof gameAnswersTable>;
export type InsertGameAnswer = InferInsertModel<typeof gameAnswersTable>;

export type GameResult = InferSelectModel<typeof gameResultsTable>;
export type InsertGameResult = InferInsertModel<typeof gameResultsTable>;

export type PlayerGameStats = InferSelectModel<typeof playerGameStatsTable>;
export type InsertPlayerGameStats = InferInsertModel<typeof playerGameStatsTable>;
