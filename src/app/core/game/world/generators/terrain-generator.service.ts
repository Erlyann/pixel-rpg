import { Injectable } from '@angular/core';
import { TileType } from '../../../shared/enums/tile-type.enum';
import { WorldObjectType } from '../../../shared/enums/world-object-type.enum';
import { Tile } from '../../../shared/models/tile.model';
import { TILE_SIZE, MAP_HEIGHT, MAP_WIDTH } from '../../map.config';
import { WorldObject } from '../world-object.model';

@Injectable({ providedIn: 'root' })
export class TerrainGeneratorService {
   generateForestRegion(
      tiles: Tile[][],
      objects: WorldObject[],
      startX: number = 20,
      startY: number = 20,
      width: number = 30,
      height: number = 20,
   ): WorldObject[] {
      for (let y = startY; y < startY + height; y++) {
         for (let x = startX; x < startX + width; x++) {
            if (tiles[y][x].type !== TileType.Grass) {
               continue;
            }

            const random = Math.random();

            if (random < 0.25) {
               objects.push({
                  id: `${WorldObjectType.Tree}-${x}_${y}`,
                  type: WorldObjectType.Tree,

                  x: x * TILE_SIZE,
                  y: y * TILE_SIZE,

                  width: 32,
                  height: 48,

                  baseY: y * TILE_SIZE + 48,

                  collision: {
                     x: x * TILE_SIZE + 10,
                     y: y * TILE_SIZE + 42,
                     width: 7,
                     height: 1,
                  },
               });
            }
         }
      }

      return objects;
   }

   generateWaterRegion(tiles: Tile[][], centerX: number = 30, centerY: number = 15, radius: number = 8): void {
      for (let y = 0; y < MAP_HEIGHT; y++) {
         for (let x = 0; x < MAP_WIDTH; x++) {
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            const randomOffset = Math.random() * 3;

            if (distance < radius + randomOffset) {
               tiles[y][x] = {
                  type: TileType.Water,
                  walkable: false,
               };
            } else if (distance < radius + 4) {
               tiles[y][x] = {
                  type: TileType.Sand,
                  walkable: true,
               };
            }
         }
      }
   }
}
