import type { DialogOptions, OpenFrameOptions } from '../types';
import { DialogBackgroundClickEvent, DialogDragEvent, DialogTouchEvent } from './event';
import Frame from './frame';
import png1px from '../assets/png1px';
import { getViewportOffset } from '../utils';

const dialogHooks = 'mount,unmount,update,resize'.split(',');

class Dialog {
  public readonly id: symbol;
  public readonly frames: Frame[] = [];
  public target: Frame | null = null;
  public element: Element | null = null;
  public mouseOffsetX = 0;
  public mouseOffsetY = 0;
  public readonly zIndex = {
    frame: 1000,
  };
  private hook: {
    [type: string]: Function[];
  };

  constructor(args: DialogOptions) {
    this.id = args.id || Symbol('Dialog');
    this.zIndex = Object.assign(this.zIndex, args.zIndex);
    this.hook = {};
    dialogHooks.forEach((hook) => {
      this.hook[hook] = [];
      if (args.hook) {
        this.on('mount', args.hook[hook]);
      }
    });
  }

  setRootElement(value: Element) {
    this.element = value;
  }

  setFrameItemElement(index: number) {
    return (value: Element) => {
      this.frames[index].element = value;
    };
  }

  on(type: string, callback?: Function) {
    if (callback && dialogHooks.includes(type)) {
      this.hook[type].push(callback);
      return true;
    }
    return false;
  }

  off(type: string, callback: Function) {
    const events = this.hook[type];
    if (events.includes(callback)) {
      const indexOf = events.indexOf(callback);
      if (indexOf >= 0) {
        events.splice(indexOf, 1);
        return true;
      }
    }
    return false;
  }

  onMount(...args: any[]) {
    window.addEventListener('resize', (e: Event) => this.onResize(e));
    this.hook.mount.forEach((event) => {
      event.apply(this, args);
    });
  }

  onUnmount(...args: any[]) {
    window.removeEventListener('resize', (e: Event) => this.onResize(e));
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

  onResize(e: Event) {
    this.hook.resize.forEach((event) => {
      event.apply(this, e);
    });
  }

  onBgClick(e: PointerEvent) {
    this.frames.forEach((f) => {
      if (f.hook?.bgClick) {
        const bgClickEvent = new DialogBackgroundClickEvent({
          event: e,
          dialog: this,
          frame: f,
        });
        f.hook.bgClick.forEach((event) => {
          event.apply(f, bgClickEvent);
        });
      }
    });
  }

  onDragstart(event: DragEvent, id: symbol) {
    const frame = this.frames.find((f) => f.id === id);
    if (frame && frame.element && event.dataTransfer) {
      /** 清除拖拉顯示元素 */
      const img = new Image();
      img.src = png1px;
      event.dataTransfer.setDragImage(img, 0, 0);
      this.target = frame;
      /** 紀錄滑鼠相對於視窗的座標 */
      const viewPort = getViewportOffset(frame.element);
      this.mouseOffsetX = event.pageX - viewPort.left;
      this.mouseOffsetY = event.pageY - viewPort.top;
      frame.onDragstart(
        new DialogDragEvent({
          event,
          dialog: this,
          frame: frame,
        }),
      );
    } else {
      console.warn('not element or event not dataTransfer target');
    }
  }
  onTouchstart(event: TouchEvent, id: symbol) {
    const frame = this.frames.find((f) => f.id === id);
    if (frame) {
      frame.onTouchstart(
        new DialogTouchEvent({
          event,
          dialog: this,
          frame: frame,
        }),
      );
    }
  }

  openFrame(frame: OpenFrameOptions | Frame) {
    return new Promise((resolve, reject) => {
      try {
        if (frame instanceof Frame) {
          frame.dialogId = this.id;
          frame.close = resolve;
          frame.onError = reject;
          this.frames.push(frame);
        } else {
          const target = new Frame({
            dialogId: this.id,
            close: resolve,
            onError: reject,
            ...frame,
          });
          this.frames.push(target);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private async callbackCloseFrame(frames: Frame[], callback?: Function) {
    return await Promise.all(
      frames.map(async (f) => {
        const res = await f.onClose(this);
        if (callback) callback(res);
        return res;
      }),
    );
  }

  async closeFrame(arg?: unknown, callback?: Function) {
    let frames: Frame[] = [];
    if (typeof arg === 'number') {
      const index = arg as number;
      frames = this.frames.slice(index, index + 1);
    } else if (typeof arg === 'symbol') {
      const id = arg as symbol;
      const indexOf = this.frames.map((f) => f.id).indexOf(id);
      frames = this.frames.slice(indexOf, indexOf + 1);
    } else if (typeof arg === 'object') {
      if (arg instanceof Frame) {
        const target = arg as Frame;
        const indexOf = this.frames.indexOf(target);
        frames = this.frames.slice(indexOf, indexOf + 1);
      }
    } else if (typeof arg === 'function') {
      const func = arg as (f: Frame[]) => Frame[];
      frames = func(this.frames);
    } else {
      frames = this.frames.slice();
    }
    return await this.callbackCloseFrame(frames, callback);
  }

  getFrame(arg?: unknown) {
    if (typeof arg === 'number') {
      const index = arg as number;
      return this.frames[index];
    }
    if (typeof arg === 'symbol') {
      const id = arg as symbol;
      return this.frames.find((f) => f.id === id);
    }
  }
}

export default Dialog;
