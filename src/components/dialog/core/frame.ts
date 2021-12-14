import type { FrameOptions, FramePosition } from '../types';
import type Dialog from './dialog';
import type { DialogDragEvent, DialogTouchEvent } from './event';

const frameHooks = 'mount,unmount,update,bgClick,dragstart,touchstart'.split(',');

export default class Frame {
  id: symbol;
  dialogId: symbol;
  view: object;
  element: Element | null = null;
  top: string = '0px';
  left: string = '0px';
  close: Function | null;
  onError: Function;
  hook: {
    [type: string]: Function[];
  };

  constructor(args: FrameOptions) {
    this.id = Symbol('Frame');
    this.dialogId = args.dialogId;
    this.view = args.view;
    this.close = args.close;
    this.onError = args.onError;
    this.hook = {};
    frameHooks.forEach((hook) => {
      this.hook[hook] = [];
      if (args.hook) {
        this.on('mount', args.hook[hook]);
      }
    });
    this.setPosition(args.position || 'default');
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
    if (position === 'default') {
      this.top = `calc(${window.innerHeight / 3}px)`;
      this.left = `calc(${window.innerWidth / 2}px - 50%)`;
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
    this.hook.mount.forEach((event) => {
      event.apply(this, args);
    });
  }

  onUnmount(...args: any[]) {
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
}
