import { MapPointType } from './map-point-type.enum';

export interface MapPoint {
   x: number;
   y: number;

   type: MapPointType;
}
