import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameEngineService } from '../../core/game/game-engine.service';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../core/game/map.config';

@Component({
  selector: 'app-game-page',
  standalone: true,
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent implements AfterViewInit {
  @ViewChild('gameCanvas')
  private canvas?: ElementRef<HTMLCanvasElement>;

  readonly width = CANVAS_WIDTH;

  readonly height = CANVAS_HEIGHT;

  constructor(private _gameEngine: GameEngineService) {}

  ngAfterViewInit(): void {
    if (!this.canvas) {
      return;
    }

    this._gameEngine.initialize(this.canvas.nativeElement);
  }
}
