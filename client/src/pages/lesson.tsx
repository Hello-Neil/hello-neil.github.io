import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Heart,
  Volume2,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";
import type { 
  Lesson, 
  Question, 
  MultipleChoiceQuestion,
  FillBlankQuestion,
  TranslationQuestion,
  Language,
  CompleteLessonResponse
} from "@shared/schema";
import LevelUpModal from "@/components/level-up-modal";

export default function LessonPage() {
  const [, params] = useRoute("/lesson/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const lessonNumber = parseInt(params?.id || "1");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [fillBlanks, setFillBlanks] = useState<string[]>([]);
  const [translationAnswer, setTranslationAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<CompleteLessonResponse | null>(null);

  const selectedLanguage = localStorage.getItem("selectedLanguage") as Language;

  useEffect(() => {
    if (!selectedLanguage) {
      setLocation("/");
    }
  }, [selectedLanguage, setLocation]);

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ["/api/lesson", selectedLanguage, lessonNumber.toString()],
    enabled: !!selectedLanguage,
  });

  const completeLessonMutation = useMutation({
    mutationFn: async (data: { correctAnswers: number; totalQuestions: number }) => {
      const level = Math.floor((lessonNumber - 1) / 5) + 1;
      return apiRequest<CompleteLessonResponse>("POST", "/api/complete-lesson", {
        userId: "demo-user",
        language: selectedLanguage,
        level,
        lessonNumber,
        correctAnswers: data.correctAnswers,
        totalQuestions: data.totalQuestions,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", selectedLanguage] });
      setLevelUpData(data);
      if (data.leveledUp) {
        setShowLevelUp(true);
      } else {
        toast({
          title: "Lesson Complete!",
          description: `You earned ${data.xpEarned} XP!`,
        });
        setTimeout(() => setLocation("/dashboard"), 1500);
      }
    },
  });

  if (!selectedLanguage || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-xl font-bold mb-4">Lesson not found</h2>
          <Button onClick={() => setLocation("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / lesson.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === lesson.questions.length - 1;

  const handleCheck = () => {
    let correct = false;

    if (currentQuestion.type === "multiple_choice") {
      const mcq = currentQuestion as MultipleChoiceQuestion;
      correct = selectedAnswer === mcq.correctAnswer;
    } else if (currentQuestion.type === "fill_blank") {
      const fbq = currentQuestion as FillBlankQuestion;
      correct = fbq.blanks.every((blank, idx) => 
        fillBlanks[idx]?.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim()
      );
    } else if (currentQuestion.type === "translation") {
      const tq = currentQuestion as TranslationQuestion;
      const userAns = translationAnswer.toLowerCase().trim();
      correct = userAns === tq.correctAnswer.toLowerCase().trim() ||
                tq.acceptableAnswers.some(ans => ans.toLowerCase().trim() === userAns);
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleContinue = () => {
    if (isLastQuestion) {
      completeLessonMutation.mutate({
        correctAnswers: correctCount,
        totalQuestions: lesson.questions.length,
      });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setFillBlanks([]);
      setTranslationAnswer("");
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const handleExit = () => {
    setLocation("/dashboard");
  };

  const canCheck = 
    (currentQuestion.type === "multiple_choice" && selectedAnswer !== null) ||
    (currentQuestion.type === "fill_blank" && fillBlanks.every(b => b.trim())) ||
    (currentQuestion.type === "translation" && translationAnswer.trim());

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExit}
            data-testid="button-exit-lesson"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="flex-1 mx-6">
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-1" data-testid="text-hearts">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < hearts
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {/* Instruction */}
          <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
            {currentQuestion.instruction}
          </p>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {currentQuestion.question}
          </h2>

          {/* Question Type Specific UI */}
          {currentQuestion.type === "multiple_choice" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentQuestion as MultipleChoiceQuestion).choices.map((choice, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`
                    min-h-16 h-auto p-4 text-left justify-start whitespace-normal
                    ${selectedAnswer === index ? "border-4 border-primary" : ""}
                    ${showFeedback && selectedAnswer === index && !isCorrect ? "border-destructive" : ""}
                    ${showFeedback && index === (currentQuestion as MultipleChoiceQuestion).correctAnswer ? "border-primary" : ""}
                  `}
                  onClick={() => !showFeedback && setSelectedAnswer(index)}
                  disabled={showFeedback}
                  data-testid={`button-choice-${index}`}
                >
                  <span className="text-base">{choice}</span>
                </Button>
              ))}
            </div>
          )}

          {currentQuestion.type === "fill_blank" && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-6 text-lg">
                {(currentQuestion as FillBlankQuestion).sentence}
              </div>
              <div className="space-y-3">
                {(currentQuestion as FillBlankQuestion).blanks.map((blank, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium mb-2 block">
                      Blank {index + 1}:
                    </label>
                    <Input
                      value={fillBlanks[index] || ""}
                      onChange={(e) => {
                        const newBlanks = [...fillBlanks];
                        newBlanks[index] = e.target.value;
                        setFillBlanks(newBlanks);
                      }}
                      disabled={showFeedback}
                      className="text-lg"
                      placeholder="Type your answer..."
                      data-testid={`input-blank-${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.type === "translation" && (
            <div className="space-y-6">
              <Card className="p-6 bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xl">
                    {(currentQuestion as TranslationQuestion).sourceText}
                  </p>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Your translation:
                </label>
                <Textarea
                  value={translationAnswer}
                  onChange={(e) => setTranslationAnswer(e.target.value)}
                  disabled={showFeedback}
                  className="min-h-32 text-lg resize-none"
                  placeholder="Type your translation..."
                  data-testid="input-translation"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Panel */}
      {showFeedback && (
        <div
          className={`
            fixed bottom-0 left-0 right-0 p-6 shadow-2xl border-t-4
            ${isCorrect ? "bg-primary/10 border-t-primary" : "bg-destructive/10 border-t-destructive"}
            animate-in slide-in-from-bottom duration-300
          `}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                {isCorrect ? (
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                ) : (
                  <XCircle className="w-12 h-12 text-destructive" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {isCorrect ? "Excellent!" : "Not quite"}
                </h3>
                <p className="text-base text-muted-foreground mb-3">
                  {currentQuestion.explanation}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-foreground">
                    <strong>Correct answer:</strong>{" "}
                    {currentQuestion.type === "multiple_choice"
                      ? (currentQuestion as MultipleChoiceQuestion).choices[(currentQuestion as MultipleChoiceQuestion).correctAnswer]
                      : currentQuestion.type === "fill_blank"
                      ? (currentQuestion as FillBlankQuestion).blanks.map(b => b.correctAnswer).join(", ")
                      : (currentQuestion as TranslationQuestion).correctAnswer}
                  </p>
                )}
              </div>

              <Button
                size="lg"
                className="shrink-0 font-bold uppercase tracking-wide min-w-32"
                onClick={handleContinue}
                data-testid="button-continue"
              >
                {isLastQuestion ? "Finish" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!showFeedback && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="max-w-4xl mx-auto flex justify-center">
            <Button
              size="lg"
              disabled={!canCheck}
              onClick={handleCheck}
              className="font-bold uppercase tracking-wide min-w-48 h-14 text-lg rounded-full"
              data-testid="button-check"
            >
              Check
            </Button>
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {showLevelUp && levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          xpEarned={levelUpData.xpEarned}
          onClose={() => {
            setShowLevelUp(false);
            setLocation("/dashboard");
          }}
        />
      )}
    </div>
  );
}
