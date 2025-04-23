import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface RewardsContextType {
  rewards: Reward[];
  totalPoints: number;
  addReward: (reward: Omit<Reward, "id" | "earnedAt">) => void;
  addPoints: (points: number) => void;
  hasReward: (rewardId: string) => boolean;
  resetPoints: () => void;
}

const defaultContext: RewardsContextType = {
  rewards: [],
  totalPoints: 0,
  addReward: () => {},
  addPoints: () => {},
  hasReward: () => false,
  resetPoints: () => {},
};

const RewardsContext = createContext<RewardsContextType>(defaultContext);

export const useRewards = () => useContext(RewardsContext);

interface RewardsProviderProps {
  children: ReactNode;
}

export const RewardsProvider = ({ children }: RewardsProviderProps) => {
  const [rewards, setRewards] = useState<Reward[]>(() => {
    try {
      const savedRewards = localStorage.getItem("studentRewards");
      return savedRewards ? JSON.parse(savedRewards) : [];
    } catch (error) {
      console.error("Error loading rewards from localStorage:", error);
      return [];
    }
  });

  const [totalPoints, setTotalPoints] = useState<number>(() => {
    try {
      const savedPoints = localStorage.getItem("studentPoints");
      const parsedPoints = savedPoints ? parseInt(savedPoints, 10) : 0;

      // Ensure we have a valid number, not NaN
      return isNaN(parsedPoints) ? 0 : parsedPoints;
    } catch (error) {
      console.error("Error loading points from localStorage:", error);
      return 0;
    }
  });

  // Save rewards to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("studentRewards", JSON.stringify(rewards));
    } catch (error) {
      console.error("Error saving rewards to localStorage:", error);
    }
  }, [rewards]);

  // Save points to localStorage when they change
  useEffect(() => {
    try {
      // Ensure we're saving a valid number
      const pointsToSave = isNaN(totalPoints) ? 0 : totalPoints;
      localStorage.setItem("studentPoints", pointsToSave.toString());
    } catch (error) {
      console.error("Error saving points to localStorage:", error);
    }
  }, [totalPoints]);

  const addReward = (newReward: Omit<Reward, "id" | "earnedAt">) => {
    try {
      const rewardId = `${newReward.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}`;

      setRewards((prev) => [
        ...prev,
        {
          ...newReward,
          id: rewardId,
          earnedAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error adding reward:", error);
    }
  };

  const addPoints = (points: number) => {
    try {
      // Ensure we're adding a valid number
      if (isNaN(points)) {
        console.warn("Attempted to add NaN points, ignoring");
        return;
      }

      setTotalPoints((prev) => {
        const newTotal = prev + points;
        return isNaN(newTotal) ? prev : newTotal;
      });
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  const resetPoints = () => {
    try {
      setTotalPoints(0);
      localStorage.setItem("studentPoints", "0");
    } catch (error) {
      console.error("Error resetting points:", error);
    }
  };

  const hasReward = (rewardId: string) => {
    return rewards.some((reward) => reward.id === rewardId);
  };

  return (
    <RewardsContext.Provider
      value={{
        rewards,
        totalPoints,
        addReward,
        addPoints,
        hasReward,
        resetPoints,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};
