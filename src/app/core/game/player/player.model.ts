import { Direction } from '../../shared/enums/direction.enum';
import { PlayerAnimation } from './player-animation.enum';
import { CollisionBox } from '../collision/collision-box.model';

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

   collision: CollisionBox;
}
