import { $parent, DisplayObject } from './display-object';

export abstract class DisplayObjectContainer extends DisplayObject {
  protected _children: DisplayObject[] = [];

  get children(): readonly DisplayObject[] {
    return this._children;
  }

  addChild(child: DisplayObject): void {
    if (child === this) {
      throw new Error('A DisplayObject cannot be added as a child of itself.');
    }
    if (child.parent !== null) {
      child.parent.removeChild(child);
    }
    child[$parent] = this;
    this._children.unshift(child);
  }

  removeChild(child: DisplayObject): void {
    const index = this._children.indexOf(child);
    if (index === -1) {
      throw new Error('The DisplayObject is not a child of this container.');
    }
    this._children.splice(index, 1);
    child[$parent] = null;
  }
}
