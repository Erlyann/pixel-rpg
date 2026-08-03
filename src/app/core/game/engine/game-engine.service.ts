import { Injectable, inject } from '@angular/core';

import { World } from '../world/world.model';

import { PlayerRenderer } from '../../rendering/player-renderer';

import { TileType } from '../../shared/enums/tile-type.enum';
import { PlayerService } from '../player/player.service';
import { Tile } from '../../shared/models/tile.model';
import { WorldGeneratorService } from '../world/world-generator.service';

@Injectable({
   providedIn: 'root',
})
export class GameEngineService {
   private readonly _worldGenerator = inject(WorldGeneratorService);
   private readonly _playerService = inject(PlayerService);

   private readonly _playerRenderer = new PlayerRenderer();

   private _ctx?: CanvasRenderingContext2D;
   private _world?: World;

   private _lastTimestamp = 0;

   initialize(canvas: HTMLCanvasElement): void {
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

      this._playerService.update(deltaTime, this._world);
   }

   private _render(): void {
      if (!this._ctx || !this._world) {
         return;
      }

      this._renderWorld();

      this._renderObjects();

      this._playerRenderer.render(this._ctx, this._playerService.player);
   }

   private _renderWorld(): void {
      if (!this._ctx || !this._world) {
         return;
      }

      for (let y = 0; y < this._world.tiles.length; y++) {
         for (let x = 0; x < this._world.tiles[y].length; x++) {
            const tile: Tile = this._world.tiles[y][x];

            switch (tile.type) {
               case TileType.Grass:
                  this._ctx.fillStyle = '#4c9a4c';
                  break;
               case TileType.Water:
                  this._ctx.fillStyle = '#3f7fc4';
                  break;
               case TileType.Sand:
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
}
