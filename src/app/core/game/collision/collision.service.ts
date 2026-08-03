import { Injectable } from '@angular/core';

import { Player } from '../player/player.model';
import { WorldObject } from '../world/world-object.model';

@Injectable({
   providedIn: 'root',
})
export class CollisionService {
   checkCollision(
      player: Player, //
      playerX: number,
      playerY: number,
      object: WorldObject,
   ): boolean {
      const playerLeft = playerX + player.collision.offsetX;
      const playerRight = playerLeft + player.collision.width;
      const playerTop = playerY + player.collision.offsetY;
      const playerBottom = playerTop + player.collision.height;

      const objectLeft = object.collision.x;
      const objectRight = objectLeft + object.collision.width;
      const objectTop = object.collision.y;
      const objectBottom = objectTop + object.collision.height;

      return (
         playerLeft < objectRight && //
         playerRight > objectLeft &&
         playerTop < objectBottom &&
         playerBottom > objectTop
      );
   }
}
