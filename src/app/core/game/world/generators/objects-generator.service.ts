import { Injectable } from '@angular/core';
import { TileType } from '../../../shared/enums/tile-type.enum';
import { WorldObjectType } from '../../../shared/enums/world-object-type.enum';
import { Tile } from '../../../shared/models/tile.model';
import { MAP_WIDTH, TILE_SIZE, MAP_HEIGHT } from '../../map.config';
import { WorldObject } from '../world-object.model';

@Injectable({ providedIn: 'root' })
export class ObjectsGeneratorService {
   generateObjects(tiles: Tile[][], objectType: WorldObjectType): WorldObject[] {
      const objects: WorldObject[] = [];

      for (let i = 0; i < 50; i++) {
         const x = Math.floor(Math.random() * MAP_WIDTH) * TILE_SIZE;
         const y = Math.floor(Math.random() * MAP_HEIGHT) * TILE_SIZE;

         const objectTileX: number = x / TILE_SIZE;
         const objectTileY: number = y / TILE_SIZE;

         if (
            objectTileY > tiles.length ||
            objectTileX > tiles[0].length || //
            tiles[objectTileY][objectTileX].type !== TileType.Grass
         ) {
            continue;
         }

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
               y: y + 42,

               width: 7,
               height: 1,
            },
         });
      }

      return objects;
   }
}
