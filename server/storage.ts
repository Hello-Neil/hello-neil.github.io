import { type User, type InsertUser, type UserProgress, type InsertUserProgress, type Language } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Progress methods
  getUserProgress(userId: string, language: Language): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(progress: UserProgress): Promise<UserProgress>;
  getAllUserProgress(userId: string): Promise<UserProgress[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    
    // Create a demo user
    const demoUser: User = {
      id: "demo-user",
      username: "demo",
      password: "demo",
    };
    this.users.set(demoUser.id, demoUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserProgress(userId: string, language: Language): Promise<UserProgress | undefined> {
    const key = `${userId}-${language}`;
    return this.userProgress.get(key);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = {
      id,
      userId: insertProgress.userId,
      language: insertProgress.language,
      currentLevel: insertProgress.currentLevel || 1,
      xp: insertProgress.xp || 0,
      streak: insertProgress.streak || 0,
      lastPracticeDate: insertProgress.lastPracticeDate || new Date().toISOString(),
      completedLessons: insertProgress.completedLessons || [],
    };
    
    const key = `${progress.userId}-${progress.language}`;
    this.userProgress.set(key, progress);
    return progress;
  }

  async updateUserProgress(progress: UserProgress): Promise<UserProgress> {
    const key = `${progress.userId}-${progress.language}`;
    this.userProgress.set(key, progress);
    return progress;
  }

  async getAllUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }
}

export const storage = new MemStorage();
