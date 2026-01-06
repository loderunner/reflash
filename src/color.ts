const COLOR_REGEXP = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/;

/**
 * Represents an RGBA color with components normalized to [0, 1].
 *
 * @example
 * ```ts
 * const red = new Color(1, 0, 0, 1);
 * const blue = Color.parse('#0000ff');
 * ```
 */
export class Color {
  /** Red component, in range [0, 1]. */
  r: number;
  /** Green component, in range [0, 1]. */
  g: number;
  /** Blue component, in range [0, 1]. */
  b: number;
  /** Alpha component, in range [0, 1]. */
  a: number;

  /**
   * Creates a new Color instance.
   *
   * @param r - Red component, in range [0, 1].
   * @param g - Green component, in range [0, 1].
   * @param b - Blue component, in range [0, 1].
   * @param a - Alpha component, in range [0, 1].
   */
  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * Parses a hex color string into a Color instance.
   *
   * @param color - Hex color string in format `#RRGGBB` or `#RRGGBBAA`.
   * @returns A new Color instance.
   * @throws Error if the color string is invalid.
   *
   * @example
   * ```ts
   * const color = Color.parse('#ff00ff');
   * const withAlpha = Color.parse('#ff00ff80');
   * ```
   */
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

  /**
   * Converts the color to a hex string with alpha.
   *
   * @returns Hex color string in format `#RRGGBBAA`.
   *
   * @example
   * ```ts
   * const color = new Color(1, 0, 0, 1);
   * color.toHex(); // '#ff0000ff'
   * ```
   */
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

  /**
   * Converts the color to a CSS rgba() string.
   *
   * @returns CSS rgba color string.
   *
   * @example
   * ```ts
   * const color = new Color(1, 0, 0, 0.5);
   * color.toRGBA(); // 'rgba(255 0 0 / 0.5)'
   * ```
   */
  toRGBA(): string {
    return `rgba(${this.r * 255} ${this.g * 255} ${this.b * 255} / ${this.a})`;
  }
}
