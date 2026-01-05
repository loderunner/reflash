import type { Color } from './color';

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

export class Graphics {
  private _commands: GraphicsCommand[] = [];

  constructor() {}

  clear(): void {
    this._commands.length = 0;
  }

  beginFill(color: Color): void {
    this._commands.push({ type: 'beginFill', color });
  }

  endFill(): void {
    this._commands.push({ type: 'endFill' });
  }

  lineStyle(thickness?: number, color?: Color): void {
    this._commands.push({ type: 'lineStyle', thickness, color });
  }

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

  drawEllipse(x: number, y: number, width: number, height?: number): void {
    this._commands.push({ type: 'drawEllipse', x, y, width, height });
  }

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

  lineTo(x: number, y: number): void {
    this._commands.push({ type: 'lineTo', x, y });
  }

  moveTo(x: number, y: number): void {
    this._commands.push({ type: 'moveTo', x, y });
  }

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
            ctx.lineWidth = currentLine.width;
            ctx.strokeStyle = currentLine.color;
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
            ctx.lineWidth = currentLine.width;
            ctx.strokeStyle = currentLine.color;
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
            ctx.lineWidth = currentLine.width;
            ctx.strokeStyle = currentLine.color;
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
            ctx.lineWidth = currentLine.width;
            ctx.strokeStyle = currentLine.color;
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
