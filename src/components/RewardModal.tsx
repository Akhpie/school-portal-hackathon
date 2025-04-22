import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: string;
  title: string;
  description: string;
  points?: number;
}

const RewardModal = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  points,
}: RewardModalProps) => {
  return (
    <>
      {isOpen && <Confetti />}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-5xl mb-4">{icon}</div>
            {points !== undefined && (
              <div className="bg-primary/10 px-3 py-1 rounded-full text-primary font-semibold mb-4">
                +{points} Points
              </div>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Keep playing to earn more rewards!
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={onClose}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RewardModal;
