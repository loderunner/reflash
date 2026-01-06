import type { Color } from './color';

/** Line cap style for strokes. */
export type CapsStyle = 'none' | 'round' | 'square';

/** Line joint style for strokes. */
export type JointStyle = 'bevel' | 'miter' | 'round';

type BeginFillCommand = {
  type: 'beginFill';
  color: Color;
};

type EndFillCommand = {
  type: 'endFill';
};

type LineStyleCommand = {
  type: 'lineStyle';
  thickness?: number;
  color?: Color;
  caps?: CapsStyle;
  joints?: JointStyle;
  miterLimit?: number;
};

type DrawRectCommand = {
  type: 'drawRect';
  x: number;
  y: number;
  width: number;
  height: number;
  radiusX?: number;
  radiusY?: number;
};

type DrawEllipseCommand = {
  type: 'drawEllipse';
  x: number;
  y: number;
  width: number;
  height?: number;
};

type CurveToCommand = {
  type: 'curveTo';
  control1X: number;
  control1Y: number;
  control2X: number;
  control2Y: number;
  x: number;
  y: number;
};

type LineToCommand = {
  type: 'lineTo';
  x: number;
  y: number;
};

type MoveToCommand = {
  type: 'moveTo';
  x: number;
  y: number;
};

type GraphicsCommand =
  | BeginFillCommand
  | EndFillCommand
  | LineStyleCommand
  | DrawRectCommand
  | DrawEllipseCommand
  | CurveToCommand
  | LineToCommand
  | MoveToCommand;

/**
 * Provides a vector drawing API for shapes.
 *
 * @example
 * ```ts
 * const graphics = new Graphics();
 * graphics.beginFill(Color.parse('#ff0000'));
 * graphics.drawRect(0, 0, 100, 100);
 * graphics.endFill();
 * ```
 */
export class Graphics {
  private _commands: GraphicsCommand[] = [];

  /** Creates a new Graphics instance. */
  constructor() {}

  /** Clears all drawing commands. */
  clear(): void {
    this._commands.length = 0;
  }

  /**
   * Begins a fill operation with the specified color.
   *
   * @param color - The fill color.
   */
  beginFill(color: Color): void {
    this._commands.push({ type: 'beginFill', color });
  }

  /** Ends the current fill operation. */
  endFill(): void {
    this._commands.push({ type: 'endFill' });
  }

  /**
   * Sets the line style for subsequent drawing operations.
   * Call with no arguments or undefined thickness to disable stroke.
   *
   * @param thickness - Line thickness in pixels.
   * @param color - Line color.
   * @param caps - Line cap style.
   * @param joints - Line joint style.
   * @param miterLimit - Miter limit for miter joints.
   */
  lineStyle(
    thickness?: number,
    color?: Color,
    caps?: CapsStyle,
    joints?: JointStyle,
    miterLimit?: number,
  ): void {
    this._commands.push({
      type: 'lineStyle',
      thickness,
      color,
      caps,
      joints,
      miterLimit,
    });
  }

  /**
   * Draws a rectangle, optionally with rounded corners.
   *
   * @param x - X coordinate of the top-left corner.
   * @param y - Y coordinate of the top-left corner.
   * @param width - Width of the rectangle.
   * @param height - Height of the rectangle.
   * @param radiusX - Horizontal corner radius.
   * @param radiusY - Vertical corner radius.
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radiusX?: number,
    radiusY?: number,
  ): void {
    this._commands.push({
      type: 'drawRect',
      x,
      y,
      width,
      height,
      radiusX,
      radiusY,
    });
  }

  /**
   * Draws an ellipse or circle.
   *
   * @param x - X coordinate of the center.
   * @param y - Y coordinate of the center.
   * @param width - Width of the ellipse.
   * @param height - Height of the ellipse. If omitted, draws a circle.
   */
  drawEllipse(x: number, y: number, width: number, height?: number): void {
    this._commands.push({ type: 'drawEllipse', x, y, width, height });
  }

  /**
   * Draws a cubic Bézier curve from the current position to a point.
   *
   * @param control1X - X coordinate of the first control point.
   * @param control1Y - Y coordinate of the first control point.
   * @param control2X - X coordinate of the second control point.
   * @param control2Y - Y coordinate of the second control point.
   * @param x - X coordinate of the end point.
   * @param y - Y coordinate of the end point.
   */
  curveTo(
    control1X: number,
    control1Y: number,
    control2X: number,
    control2Y: number,
    x: number,
    y: number,
  ): void {
    this._commands.push({
      type: 'curveTo',
      control1X,
      control1Y,
      control2X,
      control2Y,
      x,
      y,
    });
  }

  /**
   * Draws a line from the current position to a point.
   *
   * @param x - X coordinate of the end point.
   * @param y - Y coordinate of the end point.
   */
  lineTo(x: number, y: number): void {
    this._commands.push({ type: 'lineTo', x, y });
  }

  /**
   * Moves the drawing position to a point without drawing.
   *
   * @param x - X coordinate to move to.
   * @param y - Y coordinate to move to.
   */
  moveTo(x: number, y: number): void {
    this._commands.push({ type: 'moveTo', x, y });
  }

  /**
   * Renders all drawing commands to the given canvas context.
   *
   * @param ctx - The canvas 2D rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    const currentPos = { x: 0, y: 0 };
    let currentFill: { path: Path2D; style: string } | null = null;
    let currentLine: { width: number; color: string } | null = null;

    ctx.moveTo(0, 0);
    for (const command of this._commands) {
      switch (command.type) {
        case 'beginFill': {
          if (currentFill !== null) {
            currentFill.path.closePath();
            ctx.fillStyle = currentFill.style;
            ctx.fill(currentFill.path);
          }
          currentFill = { path: new Path2D(), style: command.color.toRGBA() };
          currentFill.path.moveTo(currentPos.x, currentPos.y);
          break;
        }
        case 'endFill': {
          if (currentFill !== null) {
            currentFill.path.closePath();
            ctx.fillStyle = currentFill.style;
            ctx.fill(currentFill.path);
          }
          currentFill = null;
          break;
        }
        case 'lineStyle': {
          if (command.thickness === undefined) {
            currentLine = null;
          } else {
            currentLine = {
              width: command.thickness,
              color: command.color?.toRGBA() ?? 'rgba(0 0 0)',
            };
          }
          break;
        }
        case 'moveTo': {
          currentPos.x = command.x;
          currentPos.y = command.y;
          if (currentFill !== null) {
            currentFill.path.moveTo(currentPos.x, currentPos.y);
          }
          break;
        }
        case 'drawRect': {
          const rounded =
            command.radiusX !== undefined || command.radiusY !== undefined;
          const radii = rounded
            ? command.radiusX !== undefined && command.radiusY !== undefined
              ? { x: command.radiusX, y: command.radiusY }
              : (command.radiusX ?? command.radiusY ?? 0)
            : undefined;

          if (currentFill !== null) {
            if (radii !== undefined) {
              currentFill.path.roundRect(
                command.x,
                command.y,
                command.width,
                command.height,
                radii,
              );
            } else {
              currentFill.path.rect(
                command.x,
                command.y,
                command.width,
                command.height,
              );
            }
          }
          if (currentLine !== null) {
            ctx.beginPath();
            setLineStyle(ctx, currentLine);
            if (radii !== undefined) {
              ctx.roundRect(
                command.x,
                command.y,
                command.width,
                command.height,
                radii,
              );
            } else {
              ctx.rect(command.x, command.y, command.width, command.height);
            }
            ctx.stroke();
          }
          break;
        }
        case 'drawEllipse': {
          const height = command.height ?? command.width;
          const centerX = command.x;
          const centerY = command.y;
          const radiusX = command.width / 2;
          const radiusY = height / 2;
          if (currentFill !== null) {
            currentFill.path.ellipse(
              centerX,
              centerY,
              radiusX,
              radiusY,
              0,
              0,
              2 * Math.PI,
            );
          }
          if (currentLine !== null) {
            ctx.beginPath();
            setLineStyle(ctx, currentLine);
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
          }
          break;
        }
        case 'lineTo': {
          if (currentFill !== null) {
            currentFill.path.lineTo(command.x, command.y);
          }
          if (currentLine !== null) {
            ctx.beginPath();
            setLineStyle(ctx, currentLine);
            ctx.moveTo(currentPos.x, currentPos.y);
            ctx.lineTo(command.x, command.y);
            ctx.stroke();
          }
          currentPos.x = command.x;
          currentPos.y = command.y;
          break;
        }
        case 'curveTo': {
          if (currentFill !== null) {
            currentFill.path.bezierCurveTo(
              command.control1X,
              command.control1Y,
              command.control2X,
              command.control2Y,
              command.x,
              command.y,
            );
          }
          if (currentLine !== null) {
            ctx.beginPath();
            setLineStyle(ctx, currentLine);
            ctx.moveTo(currentPos.x, currentPos.y);
            ctx.bezierCurveTo(
              command.control1X,
              command.control1Y,
              command.control2X,
              command.control2Y,
              command.x,
              command.y,
            );
            ctx.stroke();
          }
          currentPos.x = command.x;
          currentPos.y = command.y;
          break;
        }
      }
    }
  }
}

function setLineStyle(
  ctx: CanvasRenderingContext2D,
  line: {
    width: number;
    color: string;
    caps?: CapsStyle;
    joints?: JointStyle;
    miterLimit?: number;
  },
): void {
  ctx.lineWidth = line.width;
  ctx.strokeStyle = line.color;
  ctx.miterLimit = line.miterLimit ?? 3;
  switch (line.caps) {
    case 'none':
      ctx.lineCap = 'butt';
      break;
    case 'round':
      ctx.lineCap = 'round';
      break;
    case 'square':
      ctx.lineCap = 'square';
      break;
    default:
      ctx.lineCap = 'round';
      break;
  }
  switch (line.joints) {
    case 'bevel':
      ctx.lineJoin = 'bevel';
      break;
    case 'miter':
      ctx.lineJoin = 'miter';
      break;
    case 'round':
      ctx.lineJoin = 'round';
      break;
    default:
      ctx.lineJoin = 'round';
      break;
  }
}
