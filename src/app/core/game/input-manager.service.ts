import { Injectable } from '@angular/core';
import { InputState } from '../shared/models/input-state.model';

@Injectable({
   providedIn: 'root',
})
export class InputManagerService {
   private readonly _pressedKeys = new Set<string>();

   constructor() {
      this._initializeKeyboardListeners();
   }

   private _initializeKeyboardListeners(): void {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
         this._pressedKeys.add(event.key.toLowerCase());
      });

      window.addEventListener('keyup', (event: KeyboardEvent) => {
         this._pressedKeys.delete(event.key.toLowerCase());
      });
   }

   isPressed(key: string): boolean {
      return this._pressedKeys.has(key.toLowerCase());
   }

   getMovement(): InputState {
      return {
         up: this.isPressed('w') || this.isPressed('ArrowUp'),
         down: this.isPressed('s') || this.isPressed('ArrowDown'),
         left: this.isPressed('a') || this.isPressed('ArrowLeft'),
         right: this.isPressed('d') || this.isPressed('ArrowRight'),
      };
   }
}
