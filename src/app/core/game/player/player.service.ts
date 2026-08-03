import { inject, Injectable, input } from '@angular/core';
import { Direction } from '../../shared/enums/direction.enum';
import { PlayerAnimation } from './player-animation.enum';
import { Player } from './player.model';

import { TILE_SIZE } from '../map.config';
import { CollisionService } from '../collision/collision.service';

import { playerAnimationFrames } from './player-animation-frames';
import { World } from '../world/world.model';
import { animationFrames } from 'rxjs';
import { InputManagerService } from '../world/input/input-manager.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
   private readonly _inputManager = inject(InputManagerService);
   private readonly _collisionService = inject(CollisionService);

   private _playerAnimationTimer = 0;
   private readonly _playerAnimationSpeed = 150;

   private _player: Player = {
      x: 640,
      y: 360,

      width: 16,
      height: 24,

      speed: 2,

      direction: Direction.Down,

      animation: PlayerAnimation.Idle,
      animationFrame: 0,

      isMoving: false,

      collision: {
         offsetX: 2,
         offsetY: 16,

         width: 12,
         height: 8,
      },
   };

   get player(): Player {
      return this._player;
   }

   update(deltaTime: number, world: World): void {
      this._updateMovement(deltaTime, world);
      this._updateAnimation(deltaTime);
   }

   private _updateMovement(deltaTime: number, world: World): void {
      const input = this._inputManager.getMovement();

      let dx = 0;
      let dy = 0;

      if (input.up) {
         dy -= 1;
         this._player.direction = Direction.Up;
      }

      if (input.down) {
         dy += 1;
         this._player.direction = Direction.Down;
      }

      if (input.left) {
         dx -= 1;
         this._player.direction = Direction.Left;
      }

      if (input.right) {
         dx += 1;
         this._player.direction = Direction.Right;
      }

      const length = Math.sqrt(dx * dx + dy * dy);

      this._player.isMoving = length > 0;

      if (length === 0) {
         return;
      }

      dx /= length;
      dy /= length;

      const movement = this._player.speed * (deltaTime / 16.67);

      const nextX = this._player.x + dx * movement;

      const nextY = this._player.y + dy * movement;

      const canMoveX =
         this._canMoveTo(nextX, this._player.y, world) && this._canWalkOnTerrain(nextX, this._player.y, world);

      const canMoveY =
         this._canMoveTo(this._player.x, nextY, world) && this._canWalkOnTerrain(this._player.x, nextY, world);

      if (canMoveX) {
         this._player.x = nextX;
      }

      if (canMoveY) {
         this._player.y = nextY;
      }

      this._clampPlayerToWorld(world);
   }

   private _clampPlayerToWorld(world: World): void {
      if (!world) {
         return;
      }

      this._player.x = Math.max(0, Math.min(this._player.x, world.width - this._player.width));
      this._player.y = Math.max(0, Math.min(this._player.y, world.height - this._player.height));
   }

   private _updateAnimation(deltaTime: number): void {
      const nextAnimation = this._player.isMoving ? PlayerAnimation.Walk : PlayerAnimation.Idle;

      if (this._player.animation !== nextAnimation) {
         this._player.animation = nextAnimation;

         this._player.animationFrame = 0;

         this._playerAnimationTimer = 0;
      }

      if (this._player.animation === PlayerAnimation.Idle) {
         return;
      }

      this._playerAnimationTimer += deltaTime;

      if (this._playerAnimationTimer < this._playerAnimationSpeed) {
         return;
      }

      this._playerAnimationTimer -= this._playerAnimationSpeed;

      const frames = playerAnimationFrames[this._player.animation];
      const currentIndex = frames.indexOf(this._player.animationFrame);
      const nextIndex = (currentIndex + 1) % frames.length;

      this._player.animationFrame = frames[nextIndex];
   }

   private _canMoveTo(x: number, y: number, world: World): boolean {
      if (!world) {
         return false;
      }

      for (const object of world.objects) {
         const collision = this._collisionService.checkCollision(this._player, x, y, object);

         if (collision) {
            return false;
         }
      }

      return true;
   }

   private _canWalkOnTerrain(playerX: number, playerY: number, world: World): boolean {
      if (!world) {
         return false;
      }

      const collisionLeft = playerX + this._player.collision.offsetX;
      const collisionRight = collisionLeft + this._player.collision.width;
      const collisionTop = playerY + this._player.collision.offsetY;
      const collisionBottom = collisionTop + this._player.collision.height;

      const startTileX = Math.floor(collisionLeft / TILE_SIZE);
      const endTileX = Math.floor((collisionRight - 1) / TILE_SIZE);

      const startTileY = Math.floor(collisionTop / TILE_SIZE);
      const endTileY = Math.floor((collisionBottom - 1) / TILE_SIZE);

      for (let y = startTileY; y <= endTileY; y++) {
         for (let x = startTileX; x <= endTileX; x++) {
            const tile = world.tiles[y]?.[x];

            if (!tile) {
               return false;
            }

            if (!tile.walkable) {
               return false;
            }
         }
      }

      return true;
   }
}
