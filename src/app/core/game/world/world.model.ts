import { Tile } from '../../shared/models/tile.model';
import { WorldObject } from './world-object.model';

export interface World {
   width: number;
   height: number;

   tiles: Tile[][];
   objects: WorldObject[];
}
