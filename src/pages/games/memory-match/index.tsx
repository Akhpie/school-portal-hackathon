import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface MemoryCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatchGame = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const cardContents = ["🧮", "🔬", "🧪", "📚", "🔭", "🌍", "📝", "🎨"];

  const initializeGame = () => {
    // Create pairs of cards
    const initialCards: MemoryCard[] = [...cardContents, ...cardContents].map(
      (content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      })
    );

    // Shuffle cards
    for (let i = initialCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
    }

    setCards(initialCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const handleCardClick = (id: number) => {
    // Ignore click if card is already flipped or matched
    if (cards[id].isFlipped || cards[id].isMatched) return;
    // Ignore if already two cards flipped
    if (flippedCards.length >= 2) return;

    // Flip the card
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, id]);
  };

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const [first, second] = flippedCards;

      if (cards[first].content === cards[second].content) {
        // Match found
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedCards([]);

        toast({
          title: "Match Found!",
          variant: "default",
        });
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Check for game over
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameOver(true);
      setEndTime(Date.now());
      toast({
        title: "Game Completed!",
        description: `You finished in ${moves} moves!`,
        variant: "default",
      });
    }
  }, [cards, moves]);

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
                      card.isFlipped || card.isMatched
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }
                    transition-all duration-300
                  `}
                  onClick={() => handleCardClick(card.id)}
                >
                  {card.isFlipped || card.isMatched ? card.content : ""}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemoryMatchGame;
