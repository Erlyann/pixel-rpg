import { WorldObjectType } from '../enums/world-object-type.enum';

export interface WorldObject {
  id: string;

  type: WorldObjectType.Tree;

  x: number;
  y: number;

  width: number;
  height: number;

  baseY: number;

  collision: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
