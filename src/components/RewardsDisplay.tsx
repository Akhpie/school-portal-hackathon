import React from "react";
import { useRewards } from "@/contexts/RewardsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Trophy } from "lucide-react";

interface RewardsDisplayProps {
  showPoints?: boolean;
  showRewards?: boolean;
}

const RewardsDisplay = ({
  showPoints = true,
  showRewards = true,
}: RewardsDisplayProps) => {
  const { rewards, totalPoints } = useRewards();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            <span className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Student Rewards
            </span>
          </CardTitle>
          {showPoints && (
            <Badge variant="outline" className="px-3 py-1">
              <span className="text-sm font-semibold">
                {totalPoints} Points
              </span>
            </Badge>
          )}
        </div>
        <CardDescription>Your achievements and earned rewards</CardDescription>
      </CardHeader>
      <CardContent>
        {showRewards && rewards.length > 0 ? (
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="text-2xl" aria-hidden="true">
                  {reward.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{reward.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {reward.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Earned{" "}
                    {formatDistanceToNow(new Date(reward.earnedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : showRewards ? (
          <div className="text-center py-6 text-muted-foreground">
            <div className="text-2xl mb-2">🏆</div>
            <p>Complete games to earn rewards!</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RewardsDisplay;
