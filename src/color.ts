const COLOR_REGEXP = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/;

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static parse(color: string): Color {
    const match = color.match(COLOR_REGEXP);
    if (match === null) {
      throw new Error(`Invalid color: ${color}`);
    }
    const [, hex, alpha] = match;
    if (hex === undefined) {
      throw new Error(`Invalid color: ${color}`);
    }
    return new Color(
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
      alpha !== undefined ? parseInt(alpha, 16) / 255 : 1,
    );
  }

  toHex(): string {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = Math.round(this.a * 255);
    return (
      '#' +
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0') +
      a.toString(16).padStart(2, '0')
    );
  }

  toRGBA(): string {
    return `rgba(${this.r * 255} ${this.g * 255} ${this.b * 255} / ${this.a})`;
  }
}
