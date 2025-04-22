import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useRewards } from "@/contexts/RewardsContext";
import RewardModal from "@/components/RewardModal";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WRONG_GUESSES = 6;

// Word categories with educational words
const WORD_CATEGORIES = {
  science: [
    { word: "BIOLOGY", hint: "Study of living organisms" },
    { word: "CHEMISTRY", hint: "Study of substances and reactions" },
    { word: "PHYSICS", hint: "Study of matter and energy" },
    { word: "ASTRONOMY", hint: "Study of celestial objects" },
    { word: "GEOLOGY", hint: "Study of the Earth" },
    { word: "EVOLUTION", hint: "Change in species over time" },
  ],
  math: [
    { word: "ALGEBRA", hint: "Branch of math with variables" },
    { word: "GEOMETRY", hint: "Math of shapes and spaces" },
    { word: "CALCULUS", hint: "Math of change and motion" },
    { word: "FRACTION", hint: "Part of a whole number" },
    { word: "EQUATION", hint: "Mathematical statement with equal sides" },
    { word: "LOGARITHM", hint: "Inverse of exponential function" },
  ],
  history: [
    { word: "REVOLUTION", hint: "Radical change in society" },
    { word: "DEMOCRACY", hint: "Government by the people" },
    { word: "MONARCHY", hint: "Rule by king or queen" },
    { word: "CIVILIZATION", hint: "Advanced human society" },
    { word: "ARTIFACT", hint: "Object made by humans" },
    { word: "ARCHAEOLOGY", hint: "Study of human history through remains" },
  ],
};

interface WordData {
  word: string;
  hint: string;
}

const HangmanGame = () => {
  const navigate = useNavigate();
  const { addReward, addPoints } = useRewards();
  const [category, setCategory] = useState<keyof typeof WORD_CATEGORIES | null>(
    null
  );
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardEarned, setRewardEarned] = useState({
    icon: "",
    title: "",
    description: "",
    points: 0,
  });

  const selectCategory = (selectedCategory: keyof typeof WORD_CATEGORIES) => {
    setCategory(selectedCategory);
    startNewGame(selectedCategory);
  };

  const startNewGame = (selectedCategory?: keyof typeof WORD_CATEGORIES) => {
    const categoryToUse = selectedCategory || category;
    if (!categoryToUse) return;

    const words = WORD_CATEGORIES[categoryToUse];
    const randomWord = words[Math.floor(Math.random() * words.length)];

    setWordData(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
  };

  const handleLetterGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter) || !wordData) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!wordData.word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameOver(true);
        setGameWon(false);
        setStreak(0);
        toast({
          title: "Game Over",
          description: `The word was ${wordData.word}`,
          variant: "destructive",
        });
      }
    } else {
      // Check if player won
      const isWordGuessed = wordData.word
        .split("")
        .every((letter) => guessedLetters.includes(letter) || letter === " ");

      if (isWordGuessed) {
        setGameOver(true);
        setGameWon(true);
        const newStreak = streak + 1;
        setStreak(newStreak);

        // Award points based on word length and wrong guesses
        const points = Math.max(5, wordData.word.length * 2 - wrongGuesses * 2);
        addPoints(points);

        toast({
          title: "You won!",
          description: `You guessed the word! +${points} points`,
        });

        // Award special rewards for streaks
        if (newStreak === 3) {
          setRewardEarned({
            icon: "🔥",
            title: "Word Streak",
            description: "You've guessed 3 words in a row!",
            points: 25,
          });
          addReward({
            name: "Word Streak",
            description: "Guessed 3 words in a row in Hangman",
            icon: "🔥",
          });
          addPoints(25);
          setShowReward(true);
        } else if (newStreak === 5) {
          setRewardEarned({
            icon: "🧠",
            title: "Vocabulary Master",
            description: "Your vocabulary knowledge is impressive!",
            points: 50,
          });
          addReward({
            name: "Vocabulary Master",
            description: "Guessed 5 words in a row in Hangman",
            icon: "🧠",
          });
          addPoints(50);
          setShowReward(true);
        } else if (wrongGuesses === 0) {
          setRewardEarned({
            icon: "✨",
            title: "Perfect Guess",
            description: "You guessed the word without any mistakes!",
            points: 20,
          });
          addReward({
            name: "Perfect Guess",
            description: "Guessed a word without any mistakes",
            icon: "✨",
          });
          addPoints(20);
          setShowReward(true);
        }
      }
    }
  };

  const displayWord = () => {
    if (!wordData) return "";

    return wordData.word
      .split("")
      .map((letter) => {
        if (letter === " ") return " ";
        return guessedLetters.includes(letter) ? letter : "_";
      })
      .join(" ");
  };

  const renderHangman = () => {
    return (
      <div className="w-24 h-32 mx-auto relative">
        {/* Base */}
        <div className="absolute bottom-0 left-0 w-24 h-1 bg-black"></div>

        {/* Pole */}
        <div className="absolute bottom-0 left-5 w-1 h-32 bg-black"></div>

        {/* Top */}
        <div className="absolute top-0 left-5 w-14 h-1 bg-black"></div>

        {/* Rope */}
        <div className="absolute top-0 right-5 w-1 h-4 bg-black"></div>

        {/* Head */}
        {wrongGuesses > 0 && (
          <div className="absolute top-4 right-3 w-6 h-6 rounded-full border-2 border-black"></div>
        )}

        {/* Body */}
        {wrongGuesses > 1 && (
          <div className="absolute top-10 right-5 w-1 h-10 bg-black"></div>
        )}

        {/* Left arm */}
        {wrongGuesses > 2 && (
          <div className="absolute top-12 right-5 w-6 h-1 bg-black transform rotate-45 origin-left"></div>
        )}

        {/* Right arm */}
        {wrongGuesses > 3 && (
          <div className="absolute top-12 right-0 w-6 h-1 bg-black transform -rotate-45 origin-right"></div>
        )}

        {/* Left leg */}
        {wrongGuesses > 4 && (
          <div className="absolute top-20 right-5 w-6 h-1 bg-black transform rotate-45 origin-left"></div>
        )}

        {/* Right leg */}
        {wrongGuesses > 5 && (
          <div className="absolute top-20 right-0 w-6 h-1 bg-black transform -rotate-45 origin-right"></div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={() => navigate("/games")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
        <h1 className="text-3xl font-bold">Hangman</h1>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Guess the Word</CardTitle>
              {category && (
                <Badge variant="outline" className="capitalize">
                  {category}
                </Badge>
              )}
            </div>
            {category && (
              <div className="flex justify-between mt-2">
                <Badge variant="secondary">Streak: {streak}</Badge>
                <Badge variant="outline">
                  Guesses Left: {MAX_WRONG_GUESSES - wrongGuesses}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!category ? (
              <div className="text-center p-6">
                <p className="mb-4">Choose a category to start the game:</p>
                <div className="space-y-2">
                  {Object.keys(WORD_CATEGORIES).map((cat) => (
                    <Button
                      key={cat}
                      onClick={() =>
                        selectCategory(cat as keyof typeof WORD_CATEGORIES)
                      }
                      className="w-full capitalize"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {renderHangman()}

                  <div className="text-center">
                    <div className="font-mono text-2xl tracking-widest mb-2">
                      {displayWord()}
                    </div>
                    {wordData && (
                      <div className="text-sm text-muted-foreground">
                        Hint: {wordData.hint}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center gap-1">
                    {ALPHABET.map((letter) => (
                      <Button
                        key={letter}
                        variant={
                          guessedLetters.includes(letter)
                            ? wordData && wordData.word.includes(letter)
                              ? "default"
                              : "destructive"
                            : "outline"
                        }
                        size="sm"
                        className="w-9 h-9 p-0"
                        disabled={gameOver || guessedLetters.includes(letter)}
                        onClick={() => handleLetterGuess(letter)}
                      >
                        {letter}
                      </Button>
                    ))}
                  </div>
                </div>

                {gameOver && (
                  <div className="mt-4 text-center">
                    <p className={gameWon ? "text-green-600" : "text-red-500"}>
                      {gameWon ? "You won!" : "Game over!"}
                    </p>
                    <Button
                      onClick={() => startNewGame()}
                      className="mt-2 w-full"
                    >
                      Play Again
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Guess the word before the hangman is complete!
          </CardFooter>
        </Card>
      </div>

      <RewardModal
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        icon={rewardEarned.icon}
        title={rewardEarned.title}
        description={rewardEarned.description}
        points={rewardEarned.points}
      />
    </div>
  );
};

export default HangmanGame;
