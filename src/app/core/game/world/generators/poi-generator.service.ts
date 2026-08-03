import { Injectable } from '@angular/core';
import { MapConnection } from '../map/map-connection.model';
import { MapPointType } from '../map/map-point-type.enum';
import { MapPoint } from '../map/map-point.model';

@Injectable({ providedIn: 'root' })
export class PoIGeneratorService {
   points: MapPoint[] = [
      {
         x: 10,
         y: 10,
         type: MapPointType.Village,
      },

      {
         x: 50,
         y: 20,
         type: MapPointType.House,
      },
      {
         x: 80,
         y: 40,
         type: MapPointType.Dungeon,
      },
   ];

   connections: MapConnection[] = [
      {
         from: this.points[0],
         to: this.points[1],
      },

      {
         from: this.points[1],
         to: this.points[2],
      },
   ];
}
