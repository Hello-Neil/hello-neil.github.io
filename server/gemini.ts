import { GoogleGenAI } from "@google/genai";
import type { Language, Question } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateLesson(
  language: Language,
  level: number,
  lessonNumber: number
): Promise<Question[]> {
  console.log(`Generating lesson for ${language}, Level ${level}, Lesson ${lessonNumber}`);
  
  // For now, use fallback lessons to ensure reliability
  // AI generation can be enabled later once API is confirmed working
  console.log("Using fallback lesson for reliability");
  return getFallbackLesson(language, level);
  
  /* AI generation temporarily disabled for reliability
  try {
    const difficulty = getDifficultyDescription(level);
    
    const systemPrompt = `You are an expert language teacher creating engaging lessons for ${language} learners.
Create exactly 5 questions for a ${difficulty} level lesson (Level ${level}, Lesson ${lessonNumber}).

Include a mix of:
- 2 multiple choice questions (4 choices each)
- 2 fill-in-the-blank questions (1-2 blanks per question)
- 1 translation question

Questions should be appropriate for the level:
- Levels 1-2: Basic vocabulary, greetings, simple phrases
- Levels 3-5: Common expressions, basic grammar
- Levels 6-10: Intermediate vocabulary, grammar structures
- Levels 11+: Advanced topics, complex sentences

Respond with a JSON array of questions in this exact format:
[
  {
    "type": "multiple_choice",
    "question": "What does 'Hola' mean?",
    "instruction": "Select the correct translation",
    "choices": ["Hello", "Goodbye", "Thank you", "Please"],
    "correctAnswer": 0,
    "explanation": "'Hola' is the most common greeting in Spanish, meaning 'Hello'."
  },
  {
    "type": "fill_blank",
    "question": "Complete the sentence",
    "instruction": "Fill in the missing word(s)",
    "sentence": "Buenos _____, ¿cómo estás?",
    "blanks": [{ "position": 0, "correctAnswer": "días" }],
    "explanation": "'Buenos días' means 'Good morning' in Spanish."
  },
  {
    "type": "translation",
    "question": "Translate this phrase",
    "instruction": "Translate to ${language}",
    "sourceText": "Hello, how are you?",
    "correctAnswer": "Hola, ¿cómo estás?",
    "acceptableAnswers": ["Hola, como estas?", "Hola, ¿cómo está usted?"],
    "explanation": "This is a common greeting in Spanish. 'Hola' means hello, '¿cómo estás?' means how are you."
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["multiple_choice", "fill_blank", "translation"] },
              question: { type: "string" },
              instruction: { type: "string" },
              explanation: { type: "string" },
            },
            required: ["type", "question", "instruction", "explanation"],
          },
        },
      },
      contents: `Generate a lesson for ${language}, Level ${level}, Lesson ${lessonNumber}.`,
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const questions: Question[] = JSON.parse(rawJson);
    
    // Validate that we have exactly 5 questions
    if (questions.length !== 5) {
      throw new Error(`Expected 5 questions, got ${questions.length}`);
    }

    return questions;
  } catch (error) {
    console.error("Error generating lesson:", error);
    
    // Fallback to hardcoded lesson if AI fails
    return getFallbackLesson(language, level);
  }
  */
}

function getDifficultyDescription(level: number): string {
  if (level <= 2) return "beginner (basic vocabulary and greetings)";
  if (level <= 5) return "elementary (common expressions and basic grammar)";
  if (level <= 10) return "intermediate (everyday conversations and grammar)";
  if (level <= 20) return "upper-intermediate (complex topics and structures)";
  return "advanced (nuanced language and sophisticated expressions)";
}

function getFallbackLesson(language: Language, level: number): Question[] {
  const fallbackLessons: Record<Language, Question[]> = {
    Spanish: [
      {
        type: "multiple_choice",
        question: "What does 'Hola' mean?",
        instruction: "Select the correct translation",
        choices: ["Hello", "Goodbye", "Thank you", "Please"],
        correctAnswer: 0,
        explanation: "'Hola' is the most common greeting in Spanish, meaning 'Hello'.",
      },
      {
        type: "multiple_choice",
        question: "How do you say 'Thank you' in Spanish?",
        instruction: "Choose the correct answer",
        choices: ["Por favor", "Gracias", "Adiós", "Perdón"],
        correctAnswer: 1,
        explanation: "'Gracias' means 'Thank you' in Spanish.",
      },
      {
        type: "fill_blank",
        question: "Complete the greeting",
        instruction: "Fill in the missing word",
        sentence: "Buenos _____",
        blanks: [{ position: 0, correctAnswer: "días" }],
        explanation: "'Buenos días' means 'Good morning' in Spanish.",
      },
      {
        type: "fill_blank",
        question: "Complete: '¿Cómo _____ llamas?'",
        instruction: "Fill in the blank",
        sentence: "¿Cómo _____ llamas?",
        blanks: [{ position: 0, correctAnswer: "te" }],
        explanation: "'¿Cómo te llamas?' means 'What is your name?' in Spanish.",
      },
      {
        type: "translation",
        question: "Translate to Spanish",
        instruction: "Write the translation",
        sourceText: "Good morning",
        correctAnswer: "Buenos días",
        acceptableAnswers: ["buenos dias", "Buenos dias"],
        explanation: "'Buenos días' is how you say 'Good morning' in Spanish.",
      },
    ],
    French: [
      {
        type: "multiple_choice",
        question: "What does 'Bonjour' mean?",
        instruction: "Select the correct translation",
        choices: ["Goodbye", "Hello", "Thank you", "Please"],
        correctAnswer: 1,
        explanation: "'Bonjour' means 'Hello' or 'Good day' in French.",
      },
      {
        type: "multiple_choice",
        question: "How do you say 'Thank you' in French?",
        instruction: "Choose the correct answer",
        choices: ["S'il vous plaît", "Merci", "Au revoir", "Pardon"],
        correctAnswer: 1,
        explanation: "'Merci' means 'Thank you' in French.",
      },
      {
        type: "fill_blank",
        question: "Complete the greeting",
        instruction: "Fill in the missing word",
        sentence: "Bonne _____",
        blanks: [{ position: 0, correctAnswer: "journée" }],
        explanation: "'Bonne journée' means 'Have a good day' in French.",
      },
      {
        type: "fill_blank",
        question: "Complete: 'Comment _____ -vous?'",
        instruction: "Fill in the blank",
        sentence: "Comment _____ -vous?",
        blanks: [{ position: 0, correctAnswer: "allez" }],
        explanation: "'Comment allez-vous?' means 'How are you?' in French.",
      },
      {
        type: "translation",
        question: "Translate to French",
        instruction: "Write the translation",
        sourceText: "Good evening",
        correctAnswer: "Bonsoir",
        acceptableAnswers: ["bonsoir"],
        explanation: "'Bonsoir' is how you say 'Good evening' in French.",
      },
    ],
    Japanese: [
      {
        type: "multiple_choice",
        question: "What does 'こんにちは' (Konnichiwa) mean?",
        instruction: "Select the correct translation",
        choices: ["Goodbye", "Thank you", "Hello", "Please"],
        correctAnswer: 2,
        explanation: "'こんにちは' (Konnichiwa) means 'Hello' in Japanese.",
      },
      {
        type: "multiple_choice",
        question: "How do you say 'Thank you' in Japanese?",
        instruction: "Choose the correct answer",
        choices: ["すみません", "ありがとう", "さようなら", "おはよう"],
        correctAnswer: 1,
        explanation: "'ありがとう' (Arigatou) means 'Thank you' in Japanese.",
      },
      {
        type: "fill_blank",
        question: "Complete the greeting",
        instruction: "Fill in the missing hiragana",
        sentence: "おはよう_____",
        blanks: [{ position: 0, correctAnswer: "ございます" }],
        explanation: "'おはようございます' (Ohayou gozaimasu) means 'Good morning' in Japanese.",
      },
      {
        type: "fill_blank",
        question: "Complete: 'お元気_____?'",
        instruction: "Fill in the blank",
        sentence: "お元気_____?",
        blanks: [{ position: 0, correctAnswer: "ですか" }],
        explanation: "'お元気ですか?' (Ogenki desu ka?) means 'How are you?' in Japanese.",
      },
      {
        type: "translation",
        question: "Translate to Japanese",
        instruction: "Write the translation in hiragana or kanji",
        sourceText: "Good morning",
        correctAnswer: "おはようございます",
        acceptableAnswers: ["おはよう", "Ohayou gozaimasu"],
        explanation: "'おはようございます' is the polite way to say 'Good morning' in Japanese.",
      },
    ],
    German: [
      {
        type: "multiple_choice",
        question: "What does 'Guten Tag' mean?",
        instruction: "Select the correct translation",
        choices: ["Good morning", "Hello/Good day", "Goodbye", "Good evening"],
        correctAnswer: 1,
        explanation: "'Guten Tag' means 'Hello' or 'Good day' in German.",
      },
      {
        type: "multiple_choice",
        question: "How do you say 'Thank you' in German?",
        instruction: "Choose the correct answer",
        choices: ["Bitte", "Danke", "Tschüss", "Entschuldigung"],
        correctAnswer: 1,
        explanation: "'Danke' means 'Thank you' in German.",
      },
      {
        type: "fill_blank",
        question: "Complete the greeting",
        instruction: "Fill in the missing word",
        sentence: "Guten _____",
        blanks: [{ position: 0, correctAnswer: "Morgen" }],
        explanation: "'Guten Morgen' means 'Good morning' in German.",
      },
      {
        type: "fill_blank",
        question: "Complete: 'Wie _____ es dir?'",
        instruction: "Fill in the blank",
        sentence: "Wie _____ es dir?",
        blanks: [{ position: 0, correctAnswer: "geht" }],
        explanation: "'Wie geht es dir?' means 'How are you?' in German.",
      },
      {
        type: "translation",
        question: "Translate to German",
        instruction: "Write the translation",
        sourceText: "Good evening",
        correctAnswer: "Guten Abend",
        acceptableAnswers: ["guten abend", "Guten abend"],
        explanation: "'Guten Abend' is how you say 'Good evening' in German.",
      },
    ],
    Korean: [
      {
        type: "multiple_choice",
        question: "What does '안녕하세요' (Annyeonghaseyo) mean?",
        instruction: "Select the correct translation",
        choices: ["Goodbye", "Thank you", "Hello", "Please"],
        correctAnswer: 2,
        explanation: "'안녕하세요' (Annyeonghaseyo) is a polite greeting meaning 'Hello' in Korean.",
      },
      {
        type: "multiple_choice",
        question: "How do you say 'Thank you' in Korean?",
        instruction: "Choose the correct answer",
        choices: ["미안해요", "감사합니다", "안녕히 가세요", "좋아요"],
        correctAnswer: 1,
        explanation: "'감사합니다' (Gamsahamnida) means 'Thank you' in Korean.",
      },
      {
        type: "fill_blank",
        question: "Complete the greeting",
        instruction: "Fill in the missing syllable",
        sentence: "안녕_____세요",
        blanks: [{ position: 0, correctAnswer: "하" }],
        explanation: "'안녕하세요' is the standard polite greeting in Korean.",
      },
      {
        type: "fill_blank",
        question: "Complete: '어떻게 _____?'",
        instruction: "Fill in the blank",
        sentence: "어떻게 _____?",
        blanks: [{ position: 0, correctAnswer: "지내요" }],
        explanation: "'어떻게 지내요?' means 'How are you?' in Korean.",
      },
      {
        type: "translation",
        question: "Translate to Korean",
        instruction: "Write the translation in Hangul",
        sourceText: "Thank you",
        correctAnswer: "감사합니다",
        acceptableAnswers: ["고맙습니다", "Gamsahamnida"],
        explanation: "'감사합니다' is the formal way to say 'Thank you' in Korean.",
      },
    ],
    English: [
      {
        type: "multiple_choice",
        question: "What is the past tense of 'go'?",
        instruction: "Select the correct answer",
        choices: ["goed", "went", "gone", "going"],
        correctAnswer: 1,
        explanation: "'Went' is the simple past tense of the verb 'go'.",
      },
      {
        type: "multiple_choice",
        question: "Which word is a synonym for 'happy'?",
        instruction: "Choose the correct answer",
        choices: ["sad", "joyful", "angry", "tired"],
        correctAnswer: 1,
        explanation: "'Joyful' is a synonym for 'happy', both meaning feeling pleasure or contentment.",
      },
      {
        type: "fill_blank",
        question: "Complete the sentence",
        instruction: "Fill in the blank with the correct article",
        sentence: "She is _____ teacher.",
        blanks: [{ position: 0, correctAnswer: "a" }],
        explanation: "We use 'a' before words that start with a consonant sound. 'Teacher' starts with 't'.",
      },
      {
        type: "fill_blank",
        question: "Complete: 'I _____ to the store yesterday.'",
        instruction: "Fill in the blank with the correct verb form",
        sentence: "I _____ to the store yesterday.",
        blanks: [{ position: 0, correctAnswer: "went" }],
        explanation: "Since 'yesterday' indicates past time, we use the past tense 'went'.",
      },
      {
        type: "translation",
        question: "Rephrase in formal English",
        instruction: "Make this sentence more formal",
        sourceText: "I wanna go home",
        correctAnswer: "I would like to go home",
        acceptableAnswers: ["I want to go home", "I wish to go home"],
        explanation: "'I would like to' is more formal than 'I wanna', which is very informal.",
      },
    ],
  };

  return fallbackLessons[language] || fallbackLessons.English;
}
