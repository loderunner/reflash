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
square.graphics.beginFill(Color.parse('#ff0000'));
square.graphics.drawRect(0, 0, 100, 100);
square.graphics.endFill();
square.x = 200;
square.y = 100;
square.rotation = Math.PI / 4;
stage.addChild(square);

const hexagon = new Shape();

hexagon.graphics.moveTo(0, 100);
hexagon.graphics.lineTo(25, 25);
hexagon.graphics.lineStyle(1, Color.parse('#000000'));
hexagon.graphics.lineTo(100, 25);
hexagon.graphics.lineStyle(2, Color.parse('#000000'));
hexagon.graphics.lineTo(125, 100);
hexagon.graphics.lineStyle(2, Color.parse('#7f0000'));
hexagon.graphics.lineTo(100, 175);
hexagon.graphics.lineStyle(2, Color.parse('#007f00'));
hexagon.graphics.lineTo(25, 175);
hexagon.graphics.lineStyle(2, Color.parse('#0000007f'));
hexagon.graphics.lineTo(0, 100);
stage.addChild(hexagon);
