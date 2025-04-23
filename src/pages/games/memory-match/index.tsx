import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useRewards } from "@/contexts/RewardsContext";

interface MemoryCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatchGame = () => {
  const navigate = useNavigate();
  const { addPoints, addReward } = useRewards();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchesFound, setMatchesFound] = useState(0);

  const cardContents = ["🧮", "🔬", "🧪", "📚", "🔭", "🌍", "📝", "🎨"];

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = [...cardContents, ...cardContents];

    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    // Create card objects
    const newCards = cardPairs.map((content, id) => ({
      id,
      content,
      isFlipped: false,
      isMatched: false,
    }));

    // Reset game state
    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(Date.now());
    setEndTime(null);
    setIsProcessing(false);
    setMatchesFound(0);
  };

  // Handle clicking a card
  const handleCardClick = (index: number) => {
    // Ignore clicks when processing or if game is over
    if (isProcessing || gameOver) return;

    // Ignore click if card is already flipped or matched
    if (cards[index].isFlipped || cards[index].isMatched) return;

    // Ignore if we already have 2 cards flipped
    if (flippedIndices.length >= 2) return;

    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    // Add to flipped indices
    setFlippedIndices((prev) => [...prev, index]);
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    // Only check when exactly 2 cards are flipped
    if (flippedIndices.length !== 2) return;

    // Increment moves counter when two cards are flipped
    setMoves((prev) => prev + 1);

    // Prevent further card flips while processing
    setIsProcessing(true);

    const [firstIndex, secondIndex] = flippedIndices;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    // Check if contents match
    if (firstCard.content === secondCard.content) {
      // It's a match!
      setTimeout(() => {
        // Mark cards as matched
        const newCards = [...cards];
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        newCards[firstIndex].isFlipped = false;
        newCards[secondIndex].isFlipped = false;
        setCards(newCards);

        // Clear flipped indices
        setFlippedIndices([]);

        // Increment match counter
        setMatchesFound((prev) => {
          const newCount = prev + 1;

          // Show match notification
          toast({
            title: `Match Found! (${newCount} of 8)`,
            variant: "default",
          });

          return newCount;
        });

        // Allow flipping more cards
        setIsProcessing(false);
      }, 500);
    } else {
      // Not a match, flip cards back after a delay
      setTimeout(() => {
        const newCards = [...cards];
        newCards[firstIndex].isFlipped = false;
        newCards[secondIndex].isFlipped = false;
        setCards(newCards);

        // Clear flipped indices
        setFlippedIndices([]);

        // Allow flipping more cards
        setIsProcessing(false);
      }, 1000);
    }
  }, [flippedIndices, cards]);

  // Check for game completion
  useEffect(() => {
    // Game is complete when all 8 matches are found
    if (matchesFound === 8 && !gameOver) {
      setGameOver(true);
      setEndTime(Date.now());

      // Calculate score based on moves and time
      const timeInSeconds = Math.floor(
        ((endTime || Date.now()) - (startTime || Date.now())) / 1000
      );
      const basePoints = 100;
      const movesPenalty = Math.max(0, moves - 8) * 5; // Penalty for extra moves
      const timePenalty = Math.max(0, timeInSeconds - 60) * 0.5; // Penalty for extra time
      const totalPoints = Math.max(
        10,
        Math.floor(basePoints - movesPenalty - timePenalty)
      );

      // Add points to user
      addPoints(totalPoints);

      // Add special reward for efficient play
      if (moves <= 10) {
        addReward({
          name: "Memory Master",
          description: "Completed Memory Match in 10 moves or less",
          icon: "🧠",
        });
        addPoints(25); // Bonus points
      }

      toast({
        title: "Game Completed!",
        description: `You finished in ${moves} moves and earned ${totalPoints} points!`,
        variant: "default",
      });
    }
  }, [matchesFound, gameOver, moves, startTime, endTime, addPoints, addReward]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

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
        <h1 className="text-3xl font-bold">Memory Match</h1>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Match the Pairs</CardTitle>
              <Button onClick={initializeGame} size="sm">
                New Game
              </Button>
            </div>
            <div className="flex justify-between mt-2">
              <Badge variant="secondary">Moves: {moves}</Badge>
              <Badge variant="outline">Time: {getElapsedTime()}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`aspect-square flex items-center justify-center rounded-md cursor-pointer text-2xl
                    ${
                      card.isFlipped
                        ? "bg-primary text-primary-foreground"
                        : card.isMatched
                        ? "bg-green-500 text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }
                    transition-all duration-300
                  `}
                  onClick={() => handleCardClick(card.id)}
                  data-matched={card.isMatched}
                  data-flipped={card.isFlipped}
                >
                  {card.isFlipped || card.isMatched ? card.content : ""}
                </div>
              ))}
            </div>
            {gameOver && (
              <div className="mt-4 text-center">
                <p className="text-green-500 font-medium mb-2">
                  Game completed in {moves} moves and {getElapsedTime()}!
                </p>
                <Button onClick={initializeGame} className="mt-2">
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemoryMatchGame;
