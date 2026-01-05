import type { DisplayObjectContainer } from './display-object-container';
import { Matrix, Transform } from './transform';

export const $parent = Symbol('parent');

export abstract class DisplayObject {
  abstract render(ctx: CanvasRenderingContext2D): void;

  protected _x: number = 0;
  protected _y: number = 0;
  protected _scaleX: number = 1;
  protected _scaleY: number = 1;
  protected _rotation: number = 0;
  protected _alpha: number = 1;
  protected _visible: boolean = true;
  protected _transform: Transform = new Transform();

  private _transformMatrixDirty: boolean = false;

  /** @internal */
  [$parent]: DisplayObjectContainer | null = null;

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._transformMatrixDirty = true;
    this._x = value;
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._transformMatrixDirty = true;
    this._y = value;
  }

  get scaleX(): number {
    return this._scaleX;
  }
  set scaleX(value: number) {
    this._transformMatrixDirty = true;
    this._scaleX = value;
  }

  get scaleY(): number {
    return this._scaleY;
  }
  set scaleY(value: number) {
    this._transformMatrixDirty = true;
    this._scaleY = value;
  }

  get rotation(): number {
    return this._rotation;
  }
  set rotation(value: number) {
    this._transformMatrixDirty = true;
    this._rotation = value;
  }

  get alpha(): number {
    return this._alpha;
  }
  set alpha(value: number) {
    this._alpha = value;
  }

  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;
  }

  get parent(): DisplayObjectContainer | null {
    return this[$parent];
  }

  get transform(): Transform {
    if (this._transformMatrixDirty) {
      this._transform.matrix = new Matrix();
      this._transform.matrix.translate(this.x, this.y);
      this._transform.matrix.scale(this.scaleX, this.scaleY);
      this._transform.matrix.rotate(this.rotation);
      this._transformMatrixDirty = false;
    }
    return this._transform;
  }
}
