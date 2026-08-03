import { inject, Injectable } from '@angular/core';

import { TerrainGeneratorService } from './generators/terrain-generator.service';
import { ObjectsGeneratorService } from './generators/objects-generator.service';
import { PoIGeneratorService } from './generators/poi-generator.service';
import { TileType } from '../../shared/enums/tile-type.enum';
import { WorldObjectType } from '../../shared/enums/world-object-type.enum';
import { Tile } from '../../shared/models/tile.model';
import { MAP_WIDTH, TILE_SIZE, MAP_HEIGHT } from '../map.config';
import { WorldObject } from './world-object.model';
import { World } from './world.model';

@Injectable({
   providedIn: 'root',
})
export class WorldGeneratorService {
   private readonly _terrainGeneratorService = inject(TerrainGeneratorService);
   private readonly _objectsGeneratorService = inject(ObjectsGeneratorService);
   private readonly _poiGeneratorService = inject(PoIGeneratorService);

   generate(): World {
      const tiles: Tile[][] = this._generateTiles();
      const objects: WorldObject[] = this._objectsGeneratorService.generateObjects(tiles, WorldObjectType.Tree);

      //this._generatePath(tiles);

      this._terrainGeneratorService.generateWaterRegion(tiles);

      this._terrainGeneratorService.generateForestRegion(tiles, objects, 20, 20, 30, 20);

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
            row.push({
               type: TileType.Grass,
               walkable: true,
            });
         }

         tiles.push(row);
      }

      return tiles;
   }
}
