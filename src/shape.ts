import { DisplayObject } from './display-object';
import { Graphics } from './graphics';

/**
 * A display object that contains a vector graphics drawing surface.
 *
 * @example
 * ```ts
 * const shape = new Shape();
 * shape.graphics.beginFill(Color.parse('#ff0000'));
 * shape.graphics.drawRect(0, 0, 100, 100);
 * shape.graphics.endFill();
 * stage.addChild(shape);
 * ```
 */
export class Shape extends DisplayObject {
  private _graphics: Graphics;

  /** Creates a new Shape instance. */
  constructor() {
    super();
    this._graphics = new Graphics();
  }

  /** The graphics object for drawing on this shape. */
  get graphics(): Graphics {
    return this._graphics;
  }

  /**
   * Renders this shape to the given canvas context.
   *
   * @param ctx - The canvas 2D rendering context.
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) {
      return;
    }
    ctx.save();
    ctx.transform(
      this.transform.matrix.a,
      this.transform.matrix.b,
      this.transform.matrix.c,
      this.transform.matrix.d,
      this.transform.matrix.tx,
      this.transform.matrix.ty,
    );
    this._graphics.draw(ctx);
    ctx.restore();
  }
}
