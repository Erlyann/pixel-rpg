import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamePageComponent } from './features/game/game-page.component';

@Component({
  selector: 'app-root',
  imports: [GamePageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('pixel-rpg');
}
