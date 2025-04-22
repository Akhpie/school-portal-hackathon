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
}

const defaultContext: RewardsContextType = {
  rewards: [],
  totalPoints: 0,
  addReward: () => {},
  addPoints: () => {},
  hasReward: () => false,
};

const RewardsContext = createContext<RewardsContextType>(defaultContext);

export const useRewards = () => useContext(RewardsContext);

interface RewardsProviderProps {
  children: ReactNode;
}

export const RewardsProvider = ({ children }: RewardsProviderProps) => {
  const [rewards, setRewards] = useState<Reward[]>(() => {
    const savedRewards = localStorage.getItem("studentRewards");
    return savedRewards ? JSON.parse(savedRewards) : [];
  });

  const [totalPoints, setTotalPoints] = useState<number>(() => {
    const savedPoints = localStorage.getItem("studentPoints");
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  // Save rewards to localStorage when they change
  useEffect(() => {
    localStorage.setItem("studentRewards", JSON.stringify(rewards));
  }, [rewards]);

  // Save points to localStorage when they change
  useEffect(() => {
    localStorage.setItem("studentPoints", totalPoints.toString());
  }, [totalPoints]);

  const addReward = (newReward: Omit<Reward, "id" | "earnedAt">) => {
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
  };

  const addPoints = (points: number) => {
    setTotalPoints((prev) => prev + points);
  };

  const hasReward = (rewardId: string) => {
    return rewards.some((reward) => reward.id === rewardId);
  };

  return (
    <RewardsContext.Provider
      value={{ rewards, totalPoints, addReward, addPoints, hasReward }}
    >
      {children}
    </RewardsContext.Provider>
  );
};
