import type { FrameConstructor, FramePosition, PagePosition, FrameHookProperty } from './types';
import { getViewportOffset } from 'bam-utility-plugins';
import { DragEventType } from '../../enum';
import { useDialog } from './utils';
import Dialog from './dialog';

const hook: FrameHookProperty = {
  mount: [],
  unmount: [],
  update: [],
  bgclick: [],
  dragstart: [],
  dragover: [],
  dragend: [],
  touchstart: [],
  touchmove: [],
  touchend: [],
};

export default class Frame<View = any> {
  id: symbol;
  dialogId: symbol;
  view: View;
  props: object;
  isOverLimit: boolean;
  isDraggable: boolean;
  isResizable: boolean;
  isFull: boolean = false;
  position: FramePosition;
  element: Element | null = null;
  top: string = '0px';
  left: string = '0px';
  width: string | number;
  height: string | number;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  close: Function | null;
  onError: Function;
  hook: FrameHookProperty;
  resizeObserver: ResizeObserver | null = null;
  isDragged: boolean = false;
  isResized: boolean = false;
  dialogPadding: number = 60;

  constructor(args: FrameConstructor<View>) {
    this.id = Symbol('Frame');
    this.dialogId = args.dialogId;
    this.view = args.view;
    this.props = args.props || {};
    this.isOverLimit = args.isOverLimit === false ? false : true;
    this.isDraggable = args.isDraggable === false ? false : true;
    this.isResizable = args.isResizable === false ? false : true;
    this.isFull = args.isFull || false;
    this.position = args.position || 'auto';
    this.width = typeof args.width === 'number' ? args.width + 'px' : args.width || 'auto';
    this.height = typeof args.height === 'number' ? args.height + 'px' : args.height || 'auto';
    this.close = args.close;
    this.onError = args.onError;
    this.hook = { ...hook };
    Object.keys(hook).forEach((hook) => {
      if (args.hook) {
        this.on(hook, args.hook[hook]);
      }
    });
    this.setPosition(args.position || 'auto');
  }

  setFrameElement<C = {}>(value: Element | C) {
    this.element = value instanceof Element ? value : null;
  }

  setDraggable(bool: boolean) {
    if (bool) {
      this.isDraggable = true;
      this.isDragged = false;
    } else {
      this.isDraggable = false;
      this.isDragged = true;
    }
  }

  setResizable(bool: boolean) {
    if (bool) {
      this.isResizable = true;
      this.isResized = false;
    } else {
      this.isResizable = false;
      this.isResized = true;
    }
  }

  setOverLimit(bool: boolean) {
    this.isOverLimit = bool;
  }

  setFull(bool: boolean) {
    this.isFull = bool;
  }

  setPosition(position: FramePosition) {
    const dialog = useDialog(this.dialogId);
    this._setPosition(position, dialog);
  }

  protected _setPosition(position: FramePosition, dialog: Dialog) {
    if (typeof position === 'object') {
      this.top = typeof position.top === 'number' ? position.top + 'px' : position.top || '0';
      this.left = typeof position.left === 'number' ? position.left + 'px' : position.left || '0';
    }
    if (this.element) {
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      if (position === 'center') {
        this.top = window.innerHeight / 2 - elementClientHeight / 2 + 'px';
        this.left = window.innerWidth / 2 - elementClientWidth / 2 + 'px';
      }
      if (position === 'auto') {
        const length = dialog.frames.length;
        this.top = window.innerHeight / 3 - elementClientHeight / 3 + 10 * (length - 1) + 'px';
        this.left = window.innerWidth / 2 - elementClientWidth / 2 + 10 * (length - 1) + 'px';
      }
    } else {
      if (position === 'center') {
        this.top = `calc(${window.innerHeight / 2}px - 50%)`;
        this.left = `calc(${window.innerWidth / 2}px - 50%)`;
      }
      if (position === 'auto') {
        const length = dialog.frames.length;
        this.top = `calc(${window.innerHeight / 3 + 10 * (length - 1)}px)`;
        this.left = `calc(${window.innerWidth / 2 + 10 * (length - 1)}px - 50%)`;
      }
    }
  }

  setBoxSize() {
    if (this.element && this.isOverLimit) {
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      const viewPort = getViewportOffset(this.element);
      if (viewPort.left + elementClientWidth > window.innerWidth) {
        this.width = window.innerWidth - viewPort.left - this.dialogPadding + 'px';
      }
      if (viewPort.top + elementClientHeight > window.innerWidth) {
        this.height = window.innerHeight - viewPort.top - this.dialogPadding + 'px';
      }
    }
  }

  on(type: string, callback?: Function) {
    if (callback && Object.keys(hook).includes(type)) {
      this.hook[type].push(callback);
      return true;
    }
    return false;
  }

  off(type: string, callback?: Function) {
    const events = this.hook[type];
    if (callback && events.includes(callback)) {
      const indexOf = events.indexOf(callback);
      if (indexOf >= 0) {
        events.splice(indexOf, 1);
        return true;
      }
      return false;
    } else {
      events.splice(0);
      return true;
    }
  }

  async _onClose(dialog: Dialog) {
    const indexOf = dialog.frames.map((f) => f.id).indexOf(this.id);
    const frames = dialog.frames.splice(indexOf, 1);
    const target = frames[0];
    if (target?.close) await target.close(dialog);
    this.close = null;
    return target;
  }

  onClose() {
    const dialog = useDialog(this.dialogId);
    return this._onClose(dialog);
  }

  onMount(...args: any[]) {
    if (this.element) {
      this.resizeObserver = new ResizeObserver(() => {
        if (typeof this.position === 'string') {
          if (!this.isDraggable) {
            this.setPosition(this.position);
          }
          if (!this.isResizable) {
            this.setBoxSize();
          }
        }
      });
      this.resizeObserver.observe(this.element);
    }
    this.hook.mount.forEach((event) => {
      event.apply(this, args);
    });
  }

  onUnmount(...args: any[]) {
    if (this.element && this.resizeObserver) {
      this.resizeObserver.unobserve(this.element);
    }
    this.element = null;
    this.hook.unmount.forEach((event) => {
      event.apply(this, args);
    });
  }

  onUpdate(...args: any[]) {
    this.hook.update.forEach((event) => {
      event.apply(this, args);
    });
  }

  onResize(...args: any[]) {
    this.setPosition(this.position);
    this.setBoxSize();
    this.hook.update.forEach((event) => {
      event.apply(this, args);
    });
  }

  onDragstart(...args: any[]) {
    this.hook.dragstart.forEach((event) => {
      event.apply(this, args);
    });
  }

  onTouchstart(...args: any[]) {
    this.hook.touchstart.forEach((event) => {
      event.apply(this, args);
    });
  }

  onDragmove(pos: PagePosition) {
    this.isFull = false;
    if (this.element && this.isDraggable) {
      this.isDragged = true;
      const position = { top: this.top, left: this.left };
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      if (this.isOverLimit) {
        if (window.innerWidth - elementClientWidth < pos.pageX - this.mouseOffsetX) {
          position.left = window.innerWidth - elementClientWidth - 1 + 'px';
        } else if (pos.pageX - this.mouseOffsetX < 1) {
          position.left = '0';
        } else {
          position.left = pos.pageX - this.mouseOffsetX + 'px';
        }
        if (window.innerHeight - elementClientHeight < pos.pageY - this.mouseOffsetY) {
          position.top = window.innerHeight - elementClientHeight - 1 + 'px';
        } else if (pos.pageY - this.mouseOffsetY < 1) {
          position.top = '0';
        } else {
          position.top = pos.pageY - this.mouseOffsetY + 'px';
        }
      } else {
        position.top = pos.pageY - this.mouseOffsetY + 'px';
        position.left = pos.pageX - this.mouseOffsetX + 'px';
      }

      this.setPosition(position);
    }
  }

  onDragresize(pos: PagePosition, type: DragEventType) {
    this.isFull = false;
    if (this.element && this.isResizable) {
      this.isResized = true;
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      const viewPort = getViewportOffset(this.element);
      this.top = viewPort.top + 'px';
      this.left = viewPort.left + 'px';
      this.width = elementClientWidth + 'px';
      this.height = elementClientHeight + 'px';
      if (type === DragEventType.RESIZE_TOP) {
        const plusHeight = viewPort.top - pos.pageY;
        this.top = viewPort.top - plusHeight + 'px';
        this.height = elementClientHeight + plusHeight + 'px';
      }
      if (type === DragEventType.RESIZE_BOTTOM) {
        const plusHeight = pos.pageY - viewPort.top - elementClientHeight;
        this.height = elementClientHeight + plusHeight + 'px';
      }
      if (type === DragEventType.RESIZE_RIGHT) {
        const plusWidth = pos.pageX - viewPort.left - elementClientWidth;
        this.width = elementClientWidth + plusWidth + 'px';
      }
      if (type === DragEventType.RESIZE_LEFT) {
        const plusWidth = viewPort.left - pos.pageX;
        this.left = viewPort.left - plusWidth + 'px';
        this.width = elementClientWidth + plusWidth + 'px';
      }
    }
  }

  onDragover(...args: any[]) {
    this.hook.dragover.forEach((event) => {
      event.apply(this, args);
    });
  }
  onTouchmove(...args: any[]) {
    this.hook.touchmove.forEach((event) => {
      event.apply(this, args);
    });
  }
  onDragend(...args: any[]) {
    this.hook.dragend.forEach((event) => {
      event.apply(this, args);
    });
  }
  onTouchend(...args: any[]) {
    this.hook.touchend.forEach((event) => {
      event.apply(this, args);
    });
  }

  createVNode(): any {
    return this.view;
  }
}
