import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, MedalIcon, ArrowRight } from "lucide-react";
import RewardsDisplay from "@/components/RewardsDisplay";

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: "word-puzzle",
      title: "Word Puzzle",
      description: "Unscramble words related to school subjects",
      path: "/games/word-puzzle",
      icon: "🔤",
    },
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Test your memory by matching pairs of cards",
      path: "/games/memory-match",
      icon: "🎴",
    },
    {
      id: "math-quiz",
      title: "Math Quiz",
      description: "Solve fun math problems against the clock",
      path: "/games/math-quiz",
      icon: "🧮",
    },
    {
      id: "typing-speed",
      title: "Typing Speed",
      description: "Improve your typing skills and measure your WPM",
      path: "/games/typing-speed",
      icon: "⌨️",
    },
    {
      id: "hangman",
      title: "Hangman",
      description: "Guess vocabulary words letter by letter",
      path: "/games/hangman",
      icon: "📝",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6 justify-between">
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Educational Games</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <Card key={game.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">
                      {game.icon}
                    </span>
                    <CardTitle>{game.title}</CardTitle>
                  </div>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                    Game Preview
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => navigate(game.path)}
                  >
                    Play Game
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <RewardsDisplay />

          <Card className="overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MedalIcon className="h-5 w-5 text-primary" />
                Redeem Your Rewards
              </CardTitle>
              <CardDescription>
                Convert your earned points into exciting rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Visit the rewards center to redeem your earned points for
                vouchers, subscriptions, or convert them to currency.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate("/rewards")}
                className="w-full"
                variant="default"
              >
                Go to Rewards
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Games;
