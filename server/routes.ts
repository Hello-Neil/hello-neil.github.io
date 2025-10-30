import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateLesson } from "./gemini";
import {
  lessonRequestSchema,
  completeLessonSchema,
  type Language,
  type Lesson,
  type CompleteLessonResponse,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user progress for a specific language
  app.get("/api/progress/:language", async (req, res) => {
    try {
      const userId = "demo-user"; // In a real app, this would come from auth
      const language = req.params.language as Language;

      let progress = await storage.getUserProgress(userId, language);

      // Create initial progress if it doesn't exist
      if (!progress) {
        progress = await storage.createUserProgress({
          userId,
          language,
          currentLevel: 1,
          xp: 0,
          streak: 0,
          completedLessons: [],
        });
      }

      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Get a lesson
  app.get("/api/lesson/:language/:lessonNumber", async (req, res) => {
    try {
      const validation = lessonRequestSchema.safeParse({
        language: req.params.language,
        level: Math.floor((parseInt(req.params.lessonNumber) - 1) / 5) + 1,
        lessonNumber: parseInt(req.params.lessonNumber),
      });

      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request", details: validation.error });
      }

      const { language, level, lessonNumber } = validation.data;

      // Generate lesson using Gemini AI
      const questions = await generateLesson(language, level, lessonNumber);

      const lesson: Lesson = {
        id: lessonNumber,
        language,
        level,
        lessonNumber,
        questions,
        xpReward: 20, // Base XP per lesson
      };

      res.json(lesson);
    } catch (error) {
      console.error("Error generating lesson:", error);
      res.status(500).json({ error: "Failed to generate lesson" });
    }
  });

  // Complete a lesson
  app.post("/api/complete-lesson", async (req, res) => {
    try {
      const validation = completeLessonSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request", details: validation.error });
      }

      const { userId, language, level, lessonNumber, correctAnswers, totalQuestions } = validation.data;

      // Get current progress
      let progress = await storage.getUserProgress(userId, language);

      if (!progress) {
        progress = await storage.createUserProgress({
          userId,
          language,
          currentLevel: 1,
          xp: 0,
          streak: 0,
          completedLessons: [],
        });
      }

      // Calculate XP earned (based on accuracy)
      const accuracyPercent = (correctAnswers / totalQuestions) * 100;
      let xpEarned = 20; // Base XP
      
      if (accuracyPercent === 100) {
        xpEarned = 30; // Perfect score bonus
      } else if (accuracyPercent >= 80) {
        xpEarned = 25;
      } else if (accuracyPercent >= 60) {
        xpEarned = 20;
      } else {
        xpEarned = 10;
      }

      // Update progress
      const oldLevel = progress.currentLevel;
      const newXp = progress.xp + xpEarned;
      const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level
      const leveledUp = newLevel > oldLevel;

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const lastPractice = progress.lastPracticeDate?.split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let newStreak = progress.streak;
      if (lastPractice === today) {
        // Already practiced today, keep streak
        newStreak = progress.streak;
      } else if (lastPractice === yesterday) {
        // Practiced yesterday, increment streak
        newStreak = progress.streak + 1;
      } else if (!lastPractice) {
        // First time practicing
        newStreak = 1;
      } else {
        // Streak broken
        newStreak = 1;
      }

      // Add lesson to completed list if not already there
      const completedLessons = progress.completedLessons.includes(lessonNumber)
        ? progress.completedLessons
        : [...progress.completedLessons, lessonNumber];

      // Update progress in storage
      const updatedProgress = await storage.updateUserProgress({
        ...progress,
        currentLevel: newLevel,
        xp: newXp,
        streak: newStreak,
        lastPracticeDate: new Date().toISOString(),
        completedLessons,
      });

      const response: CompleteLessonResponse = {
        xpEarned,
        newXp,
        newLevel,
        leveledUp,
        newStreak,
      };

      res.json(response);
    } catch (error) {
      console.error("Error completing lesson:", error);
      res.status(500).json({ error: "Failed to complete lesson" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
