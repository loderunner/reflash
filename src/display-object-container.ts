import { $parent, DisplayObject } from './display-object';

/**
 * Base class for display objects that can contain children.
 *
 * @example
 * ```ts
 * const container = new Sprite();
 * container.addChild(childSprite);
 * ```
 */
export abstract class DisplayObjectContainer extends DisplayObject {
  protected _children: DisplayObject[] = [];

  /** The list of child display objects in this container (read-only). */
  get children(): readonly DisplayObject[] {
    return this._children;
  }

  /**
   * Adds a child display object to this container.
   * If the child already has a parent, it is removed from that parent first.
   *
   * @param child - The display object to add.
   * @throws Error if attempting to add this container as a child of itself.
   */
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

  /**
   * Removes a child display object from this container.
   *
   * @param child - The display object to remove.
   * @throws Error if the child is not a child of this container.
   */
  removeChild(child: DisplayObject): void {
    const index = this._children.indexOf(child);
    if (index === -1) {
      throw new Error('The DisplayObject is not a child of this container.');
    }
    this._children.splice(index, 1);
    child[$parent] = null;
  }
}
