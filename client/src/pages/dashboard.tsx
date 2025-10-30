import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Flame, 
  Star, 
  Lock, 
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Zap
} from "lucide-react";
import type { Language, UserProgress } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedLanguage") as Language;
    if (!saved) {
      setLocation("/");
    } else {
      setSelectedLanguage(saved);
    }
  }, [setLocation]);

  const { data: progress, isLoading } = useQuery<UserProgress>({
    queryKey: ["/api/progress", selectedLanguage],
    enabled: !!selectedLanguage,
  });

  if (!selectedLanguage || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const currentLevel = progress?.currentLevel || 1;
  const xp = progress?.xp || 0;
  const streak = progress?.streak || 0;
  const completedLessons = progress?.completedLessons || [];

  // Calculate XP for current level (100 XP per level)
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  // Generate lesson path (5 lessons per level)
  const lessons = Array.from({ length: currentLevel * 5 + 10 }, (_, i) => {
    const lessonNumber = i + 1;
    const lessonLevel = Math.floor((lessonNumber - 1) / 5) + 1;
    const isCompleted = completedLessons.includes(lessonNumber);
    const isAvailable = lessonLevel <= currentLevel && !isCompleted;
    const isLocked = lessonLevel > currentLevel;
    
    return {
      number: lessonNumber,
      level: lessonLevel,
      completed: isCompleted,
      available: isAvailable,
      locked: isLocked,
      isLevelMarker: lessonNumber % 5 === 0,
    };
  });

  const handleStartLesson = (lessonNumber: number) => {
    setLocation(`/lesson/${lessonNumber}`);
  };

  const handleBackToLanguages = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToLanguages}
            data-testid="button-back-to-languages"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Language
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedLanguage === "Spanish" ? "🇪🇸" : selectedLanguage === "French" ? "🇫🇷" : selectedLanguage === "Japanese" ? "🇯🇵" : selectedLanguage === "German" ? "🇩🇪" : selectedLanguage === "Korean" ? "🇰🇷" : "🇬🇧"}</span>
            <span className="font-bold text-lg">{selectedLanguage}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {/* Current Level */}
          <Card className="p-6 hover-elevate">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Current Level</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-current-level">
                  {currentLevel}
                </p>
              </div>
            </div>
          </Card>

          {/* Total XP */}
          <Card className="p-6 hover-elevate">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg">
                <Star className="w-10 h-10 text-accent-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total XP</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-total-xp">
                  {xp}
                </p>
              </div>
            </div>
          </Card>

          {/* Streak */}
          <Card className="p-6 hover-elevate">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-destructive to-orange-500 flex items-center justify-center shadow-lg">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Day Streak</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-streak">
                  {streak}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-6 mb-12">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Level {currentLevel} Progress</h3>
            <span className="text-sm text-muted-foreground">
              {xpInCurrentLevel} / {xpNeededForNextLevel} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {xpNeededForNextLevel - xpInCurrentLevel} XP until Level {currentLevel + 1}
          </p>
        </Card>

        {/* Lesson Path Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">Your Learning Path</h2>

        {/* Lesson Path - Zigzag Pattern */}
        <div className="relative max-w-md mx-auto">
          <div className="space-y-8">
            {lessons.map((lesson, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={lesson.number}
                  className={`flex ${isLeft ? "justify-start" : "justify-end"} relative`}
                >
                  {/* Connecting line */}
                  {index < lessons.length - 1 && (
                    <div className={`absolute top-16 ${isLeft ? "left-8 right-0" : "right-8 left-0"} h-12 border-l-2 border-dashed border-border ${isLeft ? "ml-8" : "mr-8"}`} />
                  )}

                  {/* Lesson Node */}
                  <div className="relative z-10">
                    {lesson.isLevelMarker ? (
                      // Level Marker
                      <div className="flex flex-col items-center gap-2">
                        <Badge 
                          variant="default"
                          className="text-lg px-4 py-2 shadow-lg"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Level {lesson.level}
                        </Badge>
                      </div>
                    ) : (
                      // Regular Lesson
                      <Button
                        variant={lesson.completed ? "default" : lesson.available ? "outline" : "secondary"}
                        size="icon"
                        className={`
                          w-16 h-16 rounded-full shadow-md transition-all duration-300
                          ${lesson.available && !lesson.completed ? "hover:scale-110 animate-pulse" : ""}
                          ${lesson.completed ? "bg-primary" : ""}
                          ${lesson.locked ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                        onClick={() => lesson.available && handleStartLesson(lesson.number)}
                        disabled={lesson.locked || lesson.completed}
                        data-testid={`button-lesson-${lesson.number}`}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                        ) : lesson.locked ? (
                          <Lock className="w-8 h-8" />
                        ) : (
                          <span className="text-xl font-bold">{lesson.number}</span>
                        )}
                      </Button>
                    )}
                    
                    {/* Lesson label */}
                    {!lesson.isLevelMarker && (
                      <p className="text-xs text-center mt-2 text-muted-foreground">
                        Lesson {lesson.number}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivation message */}
        <Card className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-none">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="font-bold mb-1">Keep going!</h3>
              <p className="text-sm text-muted-foreground">
                Practice daily to maintain your streak and level up faster
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
