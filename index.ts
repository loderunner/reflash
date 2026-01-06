import { Shape, Stage } from './src';
import { Color } from './src/color';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

const stage = new Stage(canvas);
stage.pixelRatio = dpr;

const square = new Shape();
square.graphics.beginLinearGradientFill(
  [Color.parse('#ff0000'), Color.parse('#0000ff'), Color.parse('#00ff00')],
  [0, 0.5, 1],
  100,
  -50 * Math.SQRT2,
  Math.PI / 4,
);
square.graphics.drawRect(0, 0, 100, 100);
square.graphics.endFill();

square.x = 100;
square.y = 100;
square.rotation = -Math.PI / 4;
stage.addChild(square);

const circle = new Shape();
circle.graphics.beginRadialGradientFill(
  [Color.parse('#ffffff'), Color.parse('#ff7f7f'), Color.parse('#000000')],
  [0, 0.5, 1],
  50,
  0,
  0,
  -25,
  -25,
);
circle.graphics.drawEllipse(0, 0, 100);
circle.graphics.endFill();

circle.x = 50;
circle.y = 50;
stage.addChild(circle);
