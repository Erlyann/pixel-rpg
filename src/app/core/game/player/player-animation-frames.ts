import { PlayerAnimation } from './player-animation.enum';

export const playerAnimationFrames: Record<PlayerAnimation, number[]> = {
   [PlayerAnimation.Idle]: [0],
   [PlayerAnimation.Walk]: [0, 1, 2],
};
