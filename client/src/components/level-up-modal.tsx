import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap } from "lucide-react";

interface LevelUpModalProps {
  newLevel: number;
  xpEarned: number;
  onClose: () => void;
}

export default function LevelUpModal({ newLevel, xpEarned, onClose }: LevelUpModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <Card
        className={`
          max-w-md w-full p-8 text-center shadow-2xl border-2 border-primary
          transition-all duration-500
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Animated Trophy */}
        <div className="mb-6 flex justify-center">
          <div
            className={`
              w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent
              flex items-center justify-center shadow-xl
              transition-all duration-700 delay-200
              ${show ? "scale-100 rotate-0" : "scale-0 rotate-180"}
            `}
          >
            <Trophy className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Celebration Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Level Up!
        </h2>

        <p className="text-xl text-muted-foreground mb-6">
          You reached Level <span className="font-bold text-primary text-2xl">{newLevel}</span>!
        </p>

        {/* XP Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full">
            <Star className="w-5 h-5 text-accent-foreground" />
            <span className="font-bold text-lg">+{xpEarned} XP</span>
          </div>
        </div>

        {/* Motivational Text */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <p className="font-semibold">Keep it up!</p>
          </div>
          <p className="text-sm text-muted-foreground">
            You're making amazing progress on your language learning journey
          </p>
        </div>

        {/* Continue Button */}
        <Button
          size="lg"
          className="w-full font-bold uppercase tracking-wide"
          onClick={onClose}
          data-testid="button-level-up-continue"
        >
          Continue
        </Button>
      </Card>
    </div>
  );
}
