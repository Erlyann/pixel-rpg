import { PlayerAnimation } from '../enums/player-animation';

export const animationFrames: Record<PlayerAnimation, number[]> = {
   [PlayerAnimation.Idle]: [0],
   [PlayerAnimation.Walk]: [0, 1, 2],
};
