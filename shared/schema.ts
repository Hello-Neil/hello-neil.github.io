import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Language types
export type Language = "Spanish" | "French" | "Japanese" | "German" | "Korean" | "English";

export const LANGUAGES: Language[] = ["Spanish", "French", "Japanese", "German", "Korean", "English"];

// User progress per language
export interface UserProgress {
  id: string;
  userId: string;
  language: Language;
  currentLevel: number;
  xp: number;
  streak: number;
  lastPracticeDate: string;
  completedLessons: number[];
}

export const insertUserProgressSchema = z.object({
  userId: z.string(),
  language: z.enum(["Spanish", "French", "Japanese", "German", "Korean", "English"]),
  currentLevel: z.number().default(1),
  xp: z.number().default(0),
  streak: z.number().default(0),
  lastPracticeDate: z.string().optional(),
  completedLessons: z.array(z.number()).default([]),
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

// Question types for lessons
export type QuestionType = "multiple_choice" | "fill_blank" | "translation";

export interface MultipleChoiceQuestion {
  type: "multiple_choice";
  question: string;
  instruction: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FillBlankQuestion {
  type: "fill_blank";
  question: string;
  instruction: string;
  sentence: string;
  blanks: { position: number; correctAnswer: string }[];
  explanation: string;
}

export interface TranslationQuestion {
  type: "translation";
  question: string;
  instruction: string;
  sourceText: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  explanation: string;
}

export type Question = MultipleChoiceQuestion | FillBlankQuestion | TranslationQuestion;

// Lesson structure
export interface Lesson {
  id: number;
  language: Language;
  level: number;
  lessonNumber: number;
  questions: Question[];
  xpReward: number;
}

export const lessonRequestSchema = z.object({
  language: z.enum(["Spanish", "French", "Japanese", "German", "Korean", "English"]),
  level: z.number().min(1),
  lessonNumber: z.number().min(1),
});

export type LessonRequest = z.infer<typeof lessonRequestSchema>;

// Answer submission
export const answerSubmissionSchema = z.object({
  userId: z.string(),
  language: z.enum(["Spanish", "French", "Japanese", "German", "Korean", "English"]),
  level: z.number(),
  lessonNumber: z.number(),
  questionIndex: z.number(),
  userAnswer: z.union([z.string(), z.number(), z.array(z.string())]),
});

export type AnswerSubmission = z.infer<typeof answerSubmissionSchema>;

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string | number;
  explanation: string;
}

// Complete lesson submission
export const completeLessonSchema = z.object({
  userId: z.string(),
  language: z.enum(["Spanish", "French", "Japanese", "German", "Korean", "English"]),
  level: z.number(),
  lessonNumber: z.number(),
  correctAnswers: z.number(),
  totalQuestions: z.number(),
});

export type CompleteLessonRequest = z.infer<typeof completeLessonSchema>;

export interface CompleteLessonResponse {
  xpEarned: number;
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
  newStreak: number;
}
