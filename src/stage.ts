import { DisplayObjectContainer } from './display-object-container';

/**
 * The root container for the display list, responsible for rendering to a canvas.
 *
 * @example
 * ```ts
 * const canvas = document.getElementById('canvas') as HTMLCanvasElement;
 * const stage = new Stage(canvas);
 * stage.addChild(mySprite);
 * ```
 */
export class Stage extends DisplayObjectContainer {
  private _canvas: HTMLCanvasElement;
  private _pixelRatio: number;
  /** Target frame rate in frames per second. Default is 60. */
  public frameRate: number = 60;
  private _lastFrameTime: number = 0;

  /**
   * Creates a new Stage instance attached to a canvas element.
   *
   * @param canvas - The canvas element to render to.
   */
  constructor(canvas: HTMLCanvasElement) {
    super();

    this._canvas = canvas;
    this._pixelRatio = 1;

    requestAnimationFrame(() => {
      this.doRender();
    });
  }

  /** The pixel ratio for high-DPI displays. Default is 1. */
  get pixelRatio(): number {
    return this._pixelRatio;
  }
  set pixelRatio(value: number) {
    this._pixelRatio = value;
  }

  /**
   * Renders the stage and all children to the given canvas context.
   *
   * @param ctx - The canvas 2D rendering context.
   */
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
