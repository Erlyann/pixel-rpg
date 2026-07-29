import { TileType } from '../enums/tile-type.enum';

export interface Tile {
  type: TileType;
  walkable: boolean;
}
