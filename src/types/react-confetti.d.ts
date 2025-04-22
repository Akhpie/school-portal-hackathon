declare module "react-confetti" {
  import { Component } from "react";

  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    confettiSource?: {
      x?: number;
      y?: number;
      w?: number;
      h?: number;
    };
    recycle?: boolean;
    wind?: number;
    gravity?: number;
    colors?: string[];
    opacity?: number;
    run?: boolean;
    tweenDuration?: number;
    tweenFunction?: (
      currentTime: number,
      currentValue: number,
      targetValue: number,
      duration: number,
      s?: number
    ) => number;
    paperCount?: number;
    dragFriction?: number;
    onConfettiComplete?: () => void;
  }

  export default class Confetti extends Component<ConfettiProps> {}
}
