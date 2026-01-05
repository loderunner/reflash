import { DisplayObject } from './display-object';
import { Graphics } from './graphics';

export class Shape extends DisplayObject {
  private _graphics: Graphics;

  constructor() {
    super();
    this._graphics = new Graphics();
  }

  get graphics(): Graphics {
    return this._graphics;
  }

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
