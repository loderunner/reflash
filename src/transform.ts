export class Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;

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

  translate(x: number, y: number): void {
    this.concat(new Matrix(1, 0, 0, 1, x, y));
  }

  scale(x: number, y: number): void {
    this.concat(new Matrix(x, 0, 0, y, 0, 0));
  }

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

export class Transform {
  private _matrix: Matrix = new Matrix();

  get matrix(): Matrix {
    return this._matrix;
  }
  set matrix(value: Matrix) {
    this._matrix = value;
  }
}
