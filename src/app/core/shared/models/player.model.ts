import { Direction } from '../enums/direction.enum';
import { PlayerAnimation } from '../enums/player-animation';

export interface Player {
   x: number;
   y: number;

   width: number;
   height: number;

   speed: number;

   direction: Direction;

   animation: PlayerAnimation;
   animationFrame: number;

   isMoving: boolean;
}
