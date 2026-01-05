import { DisplayObjectContainer } from './display-object-container';

export class Stage extends DisplayObjectContainer {
  private _canvas: HTMLCanvasElement;
  private _pixelRatio: number;
  public frameRate: number = 60;
  private _lastFrameTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    super();

    this._canvas = canvas;
    this._pixelRatio = 1;

    requestAnimationFrame(() => {
      this.doRender();
    });
  }

  get pixelRatio(): number {
    return this._pixelRatio;
  }
  set pixelRatio(value: number) {
    this._pixelRatio = value;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.scale(this._pixelRatio, this._pixelRatio);
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (const child of this._children) {
      child.render(ctx);
    }
    ctx.restore();
  }

  private doRender(): void {
    const ctx = this._canvas.getContext('2d');
    if (ctx === null) {
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - this._lastFrameTime;
    if (deltaTime >= 1000 / this.frameRate) {
      this.render(ctx);
      this._lastFrameTime += 1000 / this.frameRate;
    }

    requestAnimationFrame(() => {
      this.doRender();
    });
  }
}
