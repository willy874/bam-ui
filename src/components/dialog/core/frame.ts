import { FrameOptions, FramePosition, EventType } from '../types';
import type Dialog from './dialog';
import type { DialogDragEvent, DialogTouchEvent } from './event';
import { useDialog } from './control';
import { getViewportOffset } from '../utils';

interface PagePosition {
  pageX: number;
  pageY: number;
}

const frameHooks = 'mount,unmount,update,bgClick,dragstart,touchstart'.split(',');

export default class Frame {
  id: symbol;
  dialogId: symbol;
  view: object;
  isOverLimit: boolean;
  isDraggable: boolean;
  isResize: boolean;
  position: FramePosition;
  element: Element | null = null;
  top: string = '0px';
  left: string = '0px';
  width: string = 'auto';
  height: string = 'auto';
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  close: Function | null;
  onError: Function;
  hook: {
    [type: string]: Function[];
  };
  resizeObserver: ResizeObserver | null = null;
  isDragged: boolean = false;
  isResized: boolean = false;

  constructor(args: FrameOptions) {
    this.id = Symbol('Frame');
    this.dialogId = args.dialogId;
    this.view = args.view;
    this.isOverLimit = args.isOverLimit === false ? false : true;
    this.isDraggable = args.isDraggable === false ? false : true;
    this.isResize = args.isResize === false ? false : true;
    this.position = args.position || 'auto';
    this.close = args.close;
    this.onError = args.onError;
    this.hook = {};
    frameHooks.forEach((hook) => {
      this.hook[hook] = [];
      if (args.hook) {
        this.on(hook, args.hook[hook]);
      }
    });
    this.setPosition(args.position || 'auto');
  }

  setFrameElement(value: Element) {
    this.element = value;
  }

  setPosition(position: FramePosition) {
    if (typeof position === 'object') {
      this.top = typeof position.top === 'number' ? position.top + 'px' : position.top;
      this.left = typeof position.left === 'number' ? position.left + 'px' : position.left;
    }
    if (position === 'center') {
      this.top = `calc(${window.innerHeight / 2}px - 50%)`;
      this.left = `calc(${window.innerWidth / 2}px - 50%)`;
    }
    if (position === 'auto') {
      const length = useDialog(this.dialogId).frames.length;
      this.top = `calc(${window.innerHeight / 3 + 10 * length}px)`;
      this.left = `calc(${window.innerWidth / 2 + 10 * length}px - 50%)`;
    }
  }

  on(type: string, callback?: Function) {
    if (callback && frameHooks.includes(type)) {
      this.hook[type].push(callback);
      return true;
    }
    return false;
  }

  off(type: string, callback?: Function) {
    const events = this.hook[type];
    if (callback) {
      if (events.includes(callback)) {
        const indexOf = events.indexOf(callback);
        if (indexOf >= 0) {
          events.splice(indexOf, 1);
          return true;
        }
      }
    } else {
      events.splice(0);
      return true;
    }
    return false;
  }

  async onClose(dialog: Dialog) {
    const indexOf = dialog.frames.map((f) => f.id).indexOf(this.id);
    const frames = dialog.frames.splice(indexOf, 1);
    const target = frames[0];
    if (target?.close) await target.close(dialog);
    this.close = null;
    return target;
  }

  onMount(...args: any[]) {
    if (this.element) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isDragged || this.isResized) {
          return;
        }
        this.setPosition(this.position);
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

  onDragstart(e: DialogDragEvent) {
    this.hook.update.forEach((event) => {
      event.call(this, e);
    });
  }

  onTouchstart(e: DialogTouchEvent) {
    this.hook.touchstart.forEach((event) => {
      event.call(this, e);
    });
  }

  onDragmove(pos: PagePosition) {
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

  onDragresize(pos: PagePosition, type: EventType) {
    if (this.element && this.isResize) {
      this.isResized = true;
      const elementClientWidth = this.element.clientWidth;
      const elementClientHeight = this.element.clientHeight;
      const viewPort = getViewportOffset(this.element);
      this.top = viewPort.top + 'px';
      this.left = viewPort.left + 'px';
      this.width = elementClientWidth + 'px';
      this.height = elementClientHeight + 'px';
      if (type === EventType.RESIZE_TOP) {
        const plusHeight = viewPort.top - pos.pageY;
        this.top = viewPort.top - plusHeight + 'px';
        this.height = elementClientHeight + plusHeight + 'px';
      }
      if (type === EventType.RESIZE_BOTTOM) {
        const plusHeight = pos.pageY - viewPort.top - elementClientHeight;
        this.height = elementClientHeight + plusHeight + 'px';
      }
      if (type === EventType.RESIZE_RIGHT) {
        const plusWidth = pos.pageX - viewPort.left - elementClientWidth;
        this.width = elementClientWidth + plusWidth + 'px';
      }
      if (type === EventType.RESIZE_LEFT) {
        const plusWidth = viewPort.left - pos.pageX;
        this.left = viewPort.left - plusWidth + 'px';
        this.width = elementClientWidth + plusWidth + 'px';
      }
    }
  }
}
