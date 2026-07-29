import { Player } from '../shared/models/player.model';

export class PlayerRenderer {
   private _spriteSheet = new Image();

   constructor() {
      this._spriteSheet.src = 'assets/player.png';
   }

   render(ctx: CanvasRenderingContext2D, player: Player): void {
      const row = player.direction;
      const column = player.animationFrame;

      const spriteWidth = 16;
      const spriteHeight = 24;

      ctx.drawImage(
         this._spriteSheet,

         column * spriteWidth,
         row * spriteHeight,

         spriteWidth,
         spriteHeight,

         player.x,
         player.y,

         player.width,
         player.height,
      );
   }
}
