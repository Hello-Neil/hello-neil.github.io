import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Globe } from "lucide-react";
import type { Language } from "@shared/schema";

const LANGUAGE_DATA: { name: Language; flag: string; learners: string; color: string }[] = [
  { name: "Spanish", flag: "🇪🇸", learners: "5M+ learners", color: "from-red-500 to-yellow-500" },
  { name: "French", flag: "🇫🇷", learners: "3M+ learners", color: "from-blue-500 to-blue-600" },
  { name: "Japanese", flag: "🇯🇵", learners: "2M+ learners", color: "from-red-600 to-pink-500" },
  { name: "German", flag: "🇩🇪", learners: "2.5M+ learners", color: "from-yellow-500 to-red-600" },
  { name: "Korean", flag: "🇰🇷", learners: "1.5M+ learners", color: "from-blue-600 to-red-500" },
  { name: "English", flag: "🇬🇧", learners: "10M+ learners", color: "from-blue-600 to-red-600" },
];

export default function LanguageSelection() {
  const [, setLocation] = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleLanguageSelect = (language: Language) => {
    localStorage.setItem("selectedLanguage", language);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-12 md:py-16 px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <Languages className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Helloneil
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-2 text-center">
          Start Learning Today
        </p>
        
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mb-8">
          Choose a language and begin your journey with AI-powered lessons that adapt to your level
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>Infinite lessons • All levels • AI-powered</span>
        </div>
      </div>

      {/* Language Grid */}
      <div className="flex-1 px-6 pb-16 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Choose Your Language
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {LANGUAGE_DATA.map((lang, index) => (
            <Card
              key={lang.name}
              className={`
                relative overflow-hidden cursor-pointer transition-all duration-300 hover-elevate active-elevate-2
                ${hoveredIndex === index ? "scale-105 shadow-xl" : "shadow-md"}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleLanguageSelect(lang.name)}
              data-testid={`card-language-${lang.name.toLowerCase()}`}
            >
              {/* Gradient background on hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-0 transition-opacity duration-300 ${hoveredIndex === index ? "opacity-10" : ""}`}
              />
              
              <div className="relative p-6 md:p-8 flex flex-col items-center gap-4">
                {/* Flag */}
                <div className="text-6xl md:text-7xl animate-in zoom-in duration-300">
                  {lang.flag}
                </div>
                
                {/* Language name */}
                <h3 className="text-xl md:text-2xl font-bold text-center">
                  {lang.name}
                </h3>
                
                {/* Learner count */}
                <p className="text-sm text-muted-foreground text-center">
                  {lang.learners}
                </p>
                
                {/* Start button */}
                <Button
                  variant="default"
                  className="w-full mt-2 font-bold uppercase tracking-wide"
                  data-testid={`button-start-${lang.name.toLowerCase()}`}
                >
                  Start
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
