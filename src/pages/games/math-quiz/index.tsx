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
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const MathQuizGame = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Generate questions with varying difficulty based on score
  const generateQuestions = (count: number): Question[] => {
    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
      // Adjust difficulty based on question number
      const difficulty = Math.min(Math.floor(i / 3) + 1, 4);
      let question: Question;

      switch (difficulty) {
        case 1: // Easy: Addition and subtraction
          const operation1 = Math.random() > 0.5 ? "+" : "-";
          const num1 = Math.floor(Math.random() * 20) + 1;
          const num2 =
            operation1 === "-"
              ? Math.floor(Math.random() * num1) + 1 // Ensure positive result for subtraction
              : Math.floor(Math.random() * 20) + 1;

          const result1 = operation1 === "+" ? num1 + num2 : num1 - num2;

          question = {
            question: `${num1} ${operation1} ${num2} = ?`,
            options: generateOptions(result1, 20),
            correctAnswer: result1.toString(),
          };
          break;

        case 2: // Medium: Multiplication and division
          if (Math.random() > 0.5) {
            // Multiplication
            const factor1 = Math.floor(Math.random() * 10) + 1;
            const factor2 = Math.floor(Math.random() * 10) + 1;
            const product = factor1 * factor2;

            question = {
              question: `${factor1} × ${factor2} = ?`,
              options: generateOptions(product, 50),
              correctAnswer: product.toString(),
            };
          } else {
            // Division with nice results
            const divisor = Math.floor(Math.random() * 10) + 1;
            const quotient = Math.floor(Math.random() * 10) + 1;
            const dividend = divisor * quotient;

            question = {
              question: `${dividend} ÷ ${divisor} = ?`,
              options: generateOptions(quotient, 20),
              correctAnswer: quotient.toString(),
            };
          }
          break;

        case 3: // Hard: Mixed operations
          const num1Hard = Math.floor(Math.random() * 20) + 5;
          const num2Hard = Math.floor(Math.random() * 10) + 1;
          const num3Hard = Math.floor(Math.random() * 10) + 1;

          const operations = ["+", "-", "×"];
          const op1 = operations[Math.floor(Math.random() * 2)];
          const op2 = operations[Math.floor(Math.random() * 3)];

          let result3;
          if (op1 === "+" && op2 === "+")
            result3 = num1Hard + num2Hard + num3Hard;
          else if (op1 === "+" && op2 === "-")
            result3 = num1Hard + num2Hard - num3Hard;
          else if (op1 === "+" && op2 === "×")
            result3 = num1Hard + num2Hard * num3Hard;
          else if (op1 === "-" && op2 === "+")
            result3 = num1Hard - num2Hard + num3Hard;
          else if (op1 === "-" && op2 === "-")
            result3 = num1Hard - num2Hard - num3Hard;
          else result3 = num1Hard - num2Hard * num3Hard;

          question = {
            question: `${num1Hard} ${op1} ${num2Hard} ${op2} ${num3Hard} = ?`,
            options: generateOptions(result3, 100),
            correctAnswer: result3.toString(),
          };
          break;

        default: // Expert: Squares, cubes, and more
          const baseNum = Math.floor(Math.random() * 15) + 2;

          if (Math.random() > 0.5) {
            // Square
            const squared = baseNum * baseNum;
            question = {
              question: `${baseNum}² = ?`,
              options: generateOptions(squared, 200),
              correctAnswer: squared.toString(),
            };
          } else {
            // Percentage
            const whole = Math.floor(Math.random() * 100) + 20;
            const percent = Math.floor(Math.random() * 10) * 10 + 10;
            const result = Math.round((percent / 100) * whole);

            question = {
              question: `${percent}% of ${whole} = ?`,
              options: generateOptions(result, 50),
              correctAnswer: result.toString(),
            };
          }
          break;
      }

      questions.push(question);
    }

    return questions;
  };

  // Generate multiple choice options
  const generateOptions = (correctAnswer: number, max: number): string[] => {
    const options = [correctAnswer.toString()];

    while (options.length < 4) {
      let option;

      // Generate a random value close to correct answer
      if (Math.random() > 0.5) {
        // Close value
        const offset = Math.floor(Math.random() * 5) + 1;
        option =
          Math.random() > 0.5 ? correctAnswer + offset : correctAnswer - offset;
      } else {
        // Random value
        option = Math.floor(Math.random() * max) + 1;
      }

      // Ensure it's not negative and not already in options
      if (option >= 0 && !options.includes(option.toString())) {
        options.push(option.toString());
      }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  const startGame = () => {
    setQuestions(generateQuestions(10));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
    setGameOver(false);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option: string) => {
    if (!isPlaying || selectedOption) return;

    setSelectedOption(option);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct answer was ${questions[currentQuestionIndex].correctAnswer}`,
        variant: "destructive",
      });
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(15);
        setSelectedOption(null);
      } else {
        setIsPlaying(false);
        setGameOver(true);
      }
    }, 1500);
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying || gameOver || selectedOption) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          // Out of time - move to next question
          toast({
            title: "Time's up!",
            description: `The correct answer was ${questions[currentQuestionIndex].correctAnswer}`,
            variant: "destructive",
          });

          setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1);
              setTimeLeft(15);
              setSelectedOption(null);
            } else {
              setIsPlaying(false);
              setGameOver(true);
            }
          }, 1500);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isPlaying, currentQuestionIndex, gameOver, selectedOption, questions]);

  // Start game on mount
  useEffect(() => {
    startGame();
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
        <h1 className="text-3xl font-bold">Math Quiz</h1>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Quick Math</CardTitle>
              <Button onClick={startGame} size="sm">
                {gameOver ? "Play Again" : "Restart"}
              </Button>
            </div>
            {isPlaying && (
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <Badge variant="secondary">
                    Score: {score}/{questions.length}
                  </Badge>
                  <Badge variant="outline">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Time left</span>
                    <span>{timeLeft}s</span>
                  </div>
                  <Progress value={(timeLeft / 15) * 100} className="h-2" />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!isPlaying && !gameOver ? (
              <div className="text-center p-6">
                <p className="mb-4">Get ready for a math challenge!</p>
                <Button onClick={startGame}>Start Quiz</Button>
              </div>
            ) : gameOver ? (
              <div className="text-center p-6">
                <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-lg mb-4">
                  Your score: {score}/{questions.length}
                </p>
                <Button onClick={startGame}>Play Again</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-xl font-medium">
                    {questions[currentQuestionIndex].question}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {questions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedOption === option
                            ? option ===
                              questions[currentQuestionIndex].correctAnswer
                              ? "default"
                              : "destructive"
                            : selectedOption &&
                              option ===
                                questions[currentQuestionIndex].correctAnswer
                            ? "default"
                            : "outline"
                        }
                        className="h-16 text-lg"
                        onClick={() => handleOptionSelect(option)}
                        disabled={!!selectedOption}
                      >
                        {option}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Challenge yourself with quick math problems!
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MathQuizGame;
