/**
 * A 2D affine transformation matrix for translation, rotation, and scaling.
 *
 * The matrix is represented as:
 * ```
 * | a  c  tx |
 * | b  d  ty |
 * | 0  0  1  |
 * ```
 *
 * @example
 * ```ts
 * const matrix = new Matrix();
 * matrix.translate(100, 50);
 * matrix.rotate(Math.PI / 4);
 * matrix.scale(2, 2);
 * ```
 */
export class Matrix {
  /** Scale X component. */
  a: number;
  /** Skew Y component. */
  b: number;
  /** Skew X component. */
  c: number;
  /** Scale Y component. */
  d: number;
  /** Translate X component. */
  tx: number;
  /** Translate Y component. */
  ty: number;

  /**
   * Creates a new Matrix instance.
   *
   * @param a - Scale X component. Default is 1.
   * @param b - Skew Y component. Default is 0.
   * @param c - Skew X component. Default is 0.
   * @param d - Scale Y component. Default is 1.
   * @param tx - Translate X component. Default is 0.
   * @param ty - Translate Y component. Default is 0.
   */
  constructor(
    a: number = 1,
    b: number = 0,
    c: number = 0,
    d: number = 1,
    tx: number = 0,
    ty: number = 0,
  ) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  /**
   * Concatenates another matrix with this matrix, modifying this matrix.
   *
   * @param matrix - The matrix to concatenate.
   */
  concat(matrix: Matrix): void {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    const tx1 = this.tx;
    const ty1 = this.ty;

    const a2 = matrix.a;
    const b2 = matrix.b;
    const c2 = matrix.c;
    const d2 = matrix.d;
    const tx2 = matrix.tx;
    const ty2 = matrix.ty;

    this.a = a1 * a2 + c1 * b2;
    this.b = b1 * a2 + d1 * b2;
    this.c = a1 * c2 + c1 * d2;
    this.d = b1 * c2 + d1 * d2;
    this.tx = a1 * tx2 + c1 * ty2 + tx1;
    this.ty = b1 * tx2 + d1 * ty2 + ty1;
  }

  /**
   * Applies a translation transformation to this matrix.
   *
   * @param x - Horizontal translation.
   * @param y - Vertical translation.
   */
  translate(x: number, y: number): void {
    this.concat(new Matrix(1, 0, 0, 1, x, y));
  }

  /**
   * Applies a scaling transformation to this matrix.
   *
   * @param x - Horizontal scale factor.
   * @param y - Vertical scale factor.
   */
  scale(x: number, y: number): void {
    this.concat(new Matrix(x, 0, 0, y, 0, 0));
  }

  /**
   * Applies a rotation transformation to this matrix.
   *
   * @param angle - Rotation angle in radians.
   */
  rotate(angle: number): void {
    this.concat(
      new Matrix(
        Math.cos(angle),
        Math.sin(angle),
        -Math.sin(angle),
        Math.cos(angle),
        0,
        0,
      ),
    );
  }
}

/**
 * Holds transformation data for a display object.
 */
export class Transform {
  private _matrix: Matrix = new Matrix();

  /** The transformation matrix. */
  get matrix(): Matrix {
    return this._matrix;
  }
  set matrix(value: Matrix) {
    this._matrix = value;
  }
}
