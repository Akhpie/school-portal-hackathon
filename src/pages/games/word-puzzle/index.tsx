import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const WordPuzzleGame = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [level, setLevel] = useState(1);

  const words = [
    { word: "MATH", hint: "Subject with numbers and equations" },
    { word: "SCIENCE", hint: "Study of natural world" },
    { word: "HISTORY", hint: "Study of past events" },
    { word: "GEOGRAPHY", hint: "Study of places and earth" },
    { word: "ENGLISH", hint: "Language arts subject" },
    { word: "BIOLOGY", hint: "Study of living organisms" },
    { word: "CHEMISTRY", hint: "Study of substances and reactions" },
    { word: "PHYSICS", hint: "Study of matter and energy" },
    { word: "ALGEBRA", hint: "Math with variables and equations" },
    { word: "LITERATURE", hint: "Study of written works" },
  ];

  const scrambleWord = (word) => {
    const wordArray = word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    return wordArray.join("");
  };

  const loadNewWord = () => {
    const wordObj = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(wordObj.word);
    setHint(wordObj.hint);
    let scrambled = scrambleWord(wordObj.word);
    // Make sure scrambled word is different from original
    while (scrambled === wordObj.word) {
      scrambled = scrambleWord(wordObj.word);
    }
    setScrambledWord(scrambled);
    setUserGuess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userGuess.toUpperCase() === currentWord) {
      toast({
        title: "Correct!",
        description: "You got it right!",
        variant: "default",
      });
      setScore(score + 10);
      setLevel(level + 1);
      loadNewWord();
    } else {
      toast({
        title: "Try Again",
        description: "That's not quite right!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadNewWord();
  }, []);

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
        <h1 className="text-3xl font-bold">Word Puzzle</h1>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Unscramble the Word</CardTitle>
              <Badge variant="outline">Level {level}</Badge>
            </div>
            <div className="flex justify-between mt-2">
              <Badge variant="secondary">Score: {score}</Badge>
              <Button variant="ghost" size="sm" onClick={loadNewWord}>
                Skip
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold tracking-wider mb-4">
                {scrambledWord}
              </p>
              <p className="text-sm text-muted-foreground mb-4">Hint: {hint}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Enter your guess"
                  className="flex-1"
                  autoComplete="off"
                />
                <Button type="submit">Check</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Unscramble as many words as you can!
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WordPuzzleGame;
