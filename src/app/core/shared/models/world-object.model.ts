import { WorldObjectType } from '../enums/world-object-type.enum';
import { CollisionBox } from './collision-box.model';
import { ObjectCollisionBox } from './object-collision-box.model';

export interface WorldObject {
   id: string;

   type: WorldObjectType.Tree;

   x: number;
   y: number;

   width: number;
   height: number;

   baseY: number;

   collision: ObjectCollisionBox;
}
