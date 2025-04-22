import React, { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Clock, RotateCcw, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useRewards } from "@/contexts/RewardsContext";
import RewardModal from "@/components/RewardModal";

const TypingSpeedGame = () => {
  const navigate = useNavigate();
  const { addReward, addPoints } = useRewards();
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardEarned, setRewardEarned] = useState({
    icon: "",
    title: "",
    description: "",
    points: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const passages = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet.",
    "Learning to type quickly and accurately is an essential skill for students in the digital age.",
    "Education is not the filling of a pail, but the lighting of a fire. Knowledge is power and practice makes perfect.",
    "Science is a way of thinking much more than it is a body of knowledge. The important thing is to never stop questioning.",
    "Mathematics is the language in which God has written the universe. It is present in every aspect of our lives.",
    "Reading is to the mind what exercise is to the body. A book is a dream that you hold in your hand.",
  ];

  const startGame = () => {
    // Select a random passage
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    setText(randomPassage);
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
    setIsPlaying(true);
    setGameComplete(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // Start the timer on first keypress
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    // Check if the typing is complete
    if (value === text) {
      const endTimeValue = Date.now();
      setEndTime(endTimeValue);

      // Calculate WPM: (characters typed / 5) / time in minutes
      const timeInMinutes =
        (endTimeValue - (startTime || endTimeValue)) / 60000;
      const wordsTyped = text.length / 5; // Standard: 5 chars = 1 word
      const calculatedWpm = Math.round(wordsTyped / timeInMinutes);

      // Calculate accuracy
      let correctChars = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === text[i]) correctChars++;
      }
      const calculatedAccuracy = Math.round((correctChars / text.length) * 100);

      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
      setIsPlaying(false);
      setGameComplete(true);

      // Award points and possibly a reward
      awardPoints(calculatedWpm, calculatedAccuracy);
    }
  };

  const awardPoints = (typingSpeed: number, typingAccuracy: number) => {
    // Base points from speed and accuracy
    const pointsEarned = Math.round((typingSpeed + typingAccuracy) / 2);

    addPoints(pointsEarned);
    toast({
      title: "Game Complete!",
      description: `You earned ${pointsEarned} points!`,
    });

    // Award rewards based on performance
    if (typingSpeed >= 60 && typingAccuracy >= 95) {
      setRewardEarned({
        icon: "⚡️",
        title: "Speed Demon",
        description:
          "Type like the wind! You've achieved amazing speed and accuracy.",
        points: 50,
      });
      addReward({
        name: "Speed Demon",
        description: "Achieved 60+ WPM with 95%+ accuracy",
        icon: "⚡️",
      });
      addPoints(50); // Bonus points
      setShowReward(true);
    } else if (typingSpeed >= 40 && typingAccuracy >= 90) {
      setRewardEarned({
        icon: "🏎️",
        title: "Quick Typist",
        description: "Your fingers are flying! Great typing skills.",
        points: 30,
      });
      addReward({
        name: "Quick Typist",
        description: "Achieved 40+ WPM with 90%+ accuracy",
        icon: "🏎️",
      });
      addPoints(30); // Bonus points
      setShowReward(true);
    } else if (typingAccuracy >= 98) {
      setRewardEarned({
        icon: "🎯",
        title: "Perfect Precision",
        description:
          "Almost perfect accuracy! Your attention to detail is impressive.",
        points: 25,
      });
      addReward({
        name: "Perfect Precision",
        description: "Achieved 98%+ typing accuracy",
        icon: "🎯",
      });
      addPoints(25); // Bonus points
      setShowReward(true);
    }
  };

  const getProgress = () => {
    if (!text) return 0;
    return (userInput.length / text.length) * 100;
  };

  const getElapsedTime = () => {
    if (!startTime) return "0s";
    const end = endTime || Date.now();
    const seconds = Math.floor((end - startTime) / 1000);
    return `${seconds}s`;
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
        <h1 className="text-3xl font-bold">Typing Speed Test</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Test Your Typing Speed</CardTitle>
              <div className="flex gap-2">
                {isPlaying && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getElapsedTime()}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startGame}
                  className="flex items-center gap-1"
                >
                  {isPlaying ? (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      {gameComplete ? "Try Again" : "Start Game"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isPlaying && !gameComplete ? (
              <div className="text-center p-6">
                <p className="mb-4">
                  Type the passage as quickly and accurately as you can!
                </p>
                <Button onClick={startGame}>Start Typing Test</Button>
              </div>
            ) : gameComplete ? (
              <div className="space-y-4">
                <div className="p-6 border rounded-md bg-muted/30">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold">Your Results</h3>
                  </div>
                  <div className="flex justify-between gap-4">
                    <div className="flex-1 text-center p-4 bg-primary/10 rounded-md">
                      <div className="text-2xl font-bold">{wpm}</div>
                      <div className="text-sm text-muted-foreground">
                        Words Per Minute
                      </div>
                    </div>
                    <div className="flex-1 text-center p-4 bg-primary/10 rounded-md">
                      <div className="text-2xl font-bold">{accuracy}%</div>
                      <div className="text-sm text-muted-foreground">
                        Accuracy
                      </div>
                    </div>
                    <div className="flex-1 text-center p-4 bg-primary/10 rounded-md">
                      <div className="text-2xl font-bold">
                        {getElapsedTime()}
                      </div>
                      <div className="text-sm text-muted-foreground">Time</div>
                    </div>
                  </div>
                </div>
                <Button onClick={startGame} className="w-full">
                  Try Another Passage
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-medium leading-relaxed whitespace-pre-wrap">
                    {text}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{Math.round(getProgress())}%</span>
                  </div>
                  <Progress value={getProgress()} className="h-2" />
                </div>
                <Input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Start typing here..."
                  className="w-full"
                  autoComplete="off"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Improve your typing speed with regular practice!
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

export default TypingSpeedGame;
