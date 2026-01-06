import type { DisplayObjectContainer } from './display-object-container';
import { Matrix, Transform } from './transform';

export const $parent = Symbol('parent');

/**
 * Base class for all objects that can be rendered on the display list.
 *
 * @example
 * ```ts
 * class Sprite extends DisplayObject {
 *   render(ctx: CanvasRenderingContext2D): void {
 *     // Custom rendering logic
 *   }
 * }
 * ```
 */
export abstract class DisplayObject {
  /**
   * Renders this display object to the given canvas context.
   *
   * @param ctx - The canvas 2D rendering context.
   */
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

  /** Horizontal position in pixels. */
  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._transformMatrixDirty = true;
    this._x = value;
  }

  /** Vertical position in pixels. */
  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._transformMatrixDirty = true;
    this._y = value;
  }

  /** Horizontal scale factor. Default is 1. */
  get scaleX(): number {
    return this._scaleX;
  }
  set scaleX(value: number) {
    this._transformMatrixDirty = true;
    this._scaleX = value;
  }

  /** Vertical scale factor. Default is 1. */
  get scaleY(): number {
    return this._scaleY;
  }
  set scaleY(value: number) {
    this._transformMatrixDirty = true;
    this._scaleY = value;
  }

  /** Rotation angle in radians. */
  get rotation(): number {
    return this._rotation;
  }
  set rotation(value: number) {
    this._transformMatrixDirty = true;
    this._rotation = value;
  }

  /** Opacity value in range [0, 1]. Default is 1. */
  get alpha(): number {
    return this._alpha;
  }
  set alpha(value: number) {
    this._alpha = value;
  }

  /** Whether this display object is visible. Default is true. */
  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;
  }

  /** The parent container of this display object, or null if none. */
  get parent(): DisplayObjectContainer | null {
    return this[$parent];
  }

  /** The transformation matrix for this display object. */
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
