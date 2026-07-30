import { Injectable } from '@angular/core';
import { World } from '../shared/models/world.model';
import { TileType } from '../shared/enums/tile-type.enum';
import { MAP_WIDTH, TILE_SIZE, MAP_HEIGHT } from './map.config';
import { Tile } from '../shared/models/tile.model';
import { WorldObject } from '../shared/models/world-object.model';
import { WorldObjectType } from '../shared/enums/world-object-type.enum';

@Injectable({
   providedIn: 'root',
})
export class WorldGeneratorService {
   generate(): World {
      const tiles = this._generateTiles();
      const objects = this._generateObjects(WorldObjectType.Tree);

      return {
         width: MAP_WIDTH * TILE_SIZE,
         height: MAP_HEIGHT * TILE_SIZE,

         tiles,
         objects,
      };
   }

   private _generateTiles(): Tile[][] {
      const tiles: Tile[][] = [];

      for (let y = 0; y < MAP_HEIGHT; y++) {
         const row: Tile[] = [];

         for (let x = 0; x < MAP_WIDTH; x++) {
            const random = Math.random();

            let type: TileType;

            if (random < 0.05) {
               type = TileType.Water;
            } else if (random < 0.1) {
               type = TileType.Sand;
            } else {
               type = TileType.Grass;
            }

            row.push({
               type,
               walkable: type !== TileType.Water,
            });
         }

         tiles.push(row);
      }

      return tiles;
   }

   private _generateObjects(objectType: WorldObjectType): WorldObject[] {
      const objects: WorldObject[] = [];

      for (let i = 0; i < 50; i++) {
         const x = Math.floor(Math.random() * MAP_WIDTH) * TILE_SIZE;
         const y = Math.floor(Math.random() * MAP_HEIGHT) * TILE_SIZE;

         objects.push({
            id: `${objectType}-${i}`,

            type: objectType,

            x,
            y,

            width: 32,
            height: 48,

            baseY: y + 48,

            collision: {
               x: x + 10,
               y: y + 32,

               width: 10,
               height: 10,
            },
         });
      }

      return objects;
   }
}
