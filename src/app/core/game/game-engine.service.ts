import { Injectable, inject } from '@angular/core';

import { Direction } from '../shared/enums/direction.enum';
import { InputState } from '../shared/models/input-state.model';
import { Player } from '../shared/models/player.model';
import { World } from '../shared/models/world.model';

import { InputManagerService } from './input-manager.service';
import { WorldGeneratorService } from './world-generator.service';
import { PlayerRenderer } from '../rendering/player-renderer';
import { PlayerAnimation } from '../shared/enums/player-animation';
import { animationFrames } from '../shared/consts/animation-frames';
import { CollisionService } from './collision/collision.service';

@Injectable({
   providedIn: 'root',
})
export class GameEngineService {
   private readonly _inputManager = inject(InputManagerService);
   private readonly _worldGenerator = inject(WorldGeneratorService);
   private readonly _collisionService = inject(CollisionService);

   private readonly _playerRenderer = new PlayerRenderer();

   private _canvas?: HTMLCanvasElement;
   private _ctx?: CanvasRenderingContext2D;
   private _world?: World;

   private _lastTimestamp = 0;

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

   private _playerAnimationTimer = 0;
   private readonly _playerAnimationSpeed = 150;

   initialize(canvas: HTMLCanvasElement): void {
      this._canvas = canvas;

      this._ctx = canvas.getContext('2d') ?? undefined;

      if (!this._ctx) {
         throw new Error('Canvas 2D context is not available');
      }

      this._world = this._worldGenerator.generate();

      this._start();
   }

   private _start(): void {
      requestAnimationFrame(this._gameLoop);
   }

   private _gameLoop = (timestamp: number): void => {
      const deltaTime = this._calculateDeltaTime(timestamp);

      this._update(deltaTime);

      this._render();

      requestAnimationFrame(this._gameLoop);
   };

   private _calculateDeltaTime(timestamp: number): number {
      if (this._lastTimestamp === 0) {
         this._lastTimestamp = timestamp;
         return 0;
      }

      const deltaTime = timestamp - this._lastTimestamp;

      this._lastTimestamp = timestamp;

      return deltaTime;
   }

   private _update(deltaTime: number): void {
      if (!this._world) {
         return;
      }

      this._updatePlayer(deltaTime);
      this._updatePlayerAnimation(deltaTime);
   }

   private _updatePlayer(deltaTime: number): void {
      if (!this._world) {
         return;
      }

      const input: InputState = this._inputManager.getMovement();

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

      if (length > 0) {
         dx /= length;
         dy /= length;

         this._player.isMoving = true;
      } else {
         this._player.isMoving = false;
      }

      const movement = this._player.speed * (deltaTime / 16.67);

      const nextX = this._player.x + dx * movement;
      const nextY = this._player.y + dy * movement;

      const canMoveX = this._canMoveTo(nextX, this._player.y);
      const canMoveY = this._canMoveTo(this._player.x, nextY);

      if (canMoveX) {
         this._player.x = nextX;
      }

      if (canMoveY) {
         this._player.y = nextY;
      }

      this._clampPlayerToWorld();
   }

   private _clampPlayerToWorld(): void {
      if (!this._world) {
         return;
      }

      this._player.x = Math.max(0, Math.min(this._player.x, this._world.width - this._player.width));
      this._player.y = Math.max(0, Math.min(this._player.y, this._world.height - this._player.height));
   }

   private _updatePlayerAnimation(deltaTime: number): void {
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

      const frames = animationFrames[this._player.animation];
      const currentIndex = frames.indexOf(this._player.animationFrame);
      const nextIndex = (currentIndex + 1) % frames.length;

      this._player.animationFrame = frames[nextIndex];
   }

   private _render(): void {
      if (!this._ctx || !this._world) {
         return;
      }

      this._renderWorld();

      this._renderObjects();

      this._playerRenderer.render(this._ctx, this._player);
   }

   private _renderWorld(): void {
      if (!this._ctx || !this._world) {
         return;
      }

      for (let y = 0; y < this._world.tiles.length; y++) {
         for (let x = 0; x < this._world.tiles[y].length; x++) {
            const tile = this._world.tiles[y][x];

            switch (tile.type) {
               case 0:
                  this._ctx.fillStyle = '#4c9a4c';
                  break;
               case 1:
                  this._ctx.fillStyle = '#3f7fc4';
                  break;
               case 2:
                  this._ctx.fillStyle = '#d6c27a';
                  break;
            }

            this._ctx.fillRect(x * 16, y * 16, 16, 16);
         }
      }
   }

   private _renderObjects(): void {
      if (!this._ctx || !this._world) {
         return;
      }

      for (const object of this._world.objects) {
         this._ctx.fillStyle = '#654321';

         this._ctx.fillRect(object.x + 12, object.y + 24, 8, 24);

         this._ctx.fillStyle = '#237a32';
         this._ctx.beginPath();

         this._ctx.arc(object.x + 16, object.y + 20, 16, 0, Math.PI * 2);

         this._ctx.fill();
      }
   }

   private _canMoveTo(x: number, y: number): boolean {
      if (!this._world) {
         return false;
      }

      for (const object of this._world.objects) {
         const collision = this._collisionService.checkCollision(this._player, x, y, object);

         if (collision) {
            return false;
         }
      }

      return true;
   }
}
