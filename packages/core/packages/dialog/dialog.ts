import type { DialogConstructor, OpenFrameOptions, DialogHookProperty } from './types';
import { isSymbol } from '@core/utils';
import { DragEventType } from '@core/enum';
import Frame from './frame';
import { createFrame, isFrame } from './utils';

type GetFrameParam = Frame | number | symbol;

const hook: DialogHookProperty = {
  mount: [],
  unmount: [],
  update: [],
  bgclick: [],
};

export default class Dialog {
  public readonly id: symbol;
  public readonly frames: Array<Frame> = [];
  public readonly isBackgroundMask: boolean;
  public readonly backgroundMask: string;
  public focusFrame: Frame | null = null;
  public eventType: DragEventType = DragEventType.NORMAL;
  public element: Element | null = null;
  public touches: Touch[] = [];
  public prevTouches: Touch[] = [];
  private hook: DialogHookProperty;

  constructor(args: DialogConstructor) {
    this.id = args.id;
    this.isBackgroundMask = args.isBackgroundMask;
    this.backgroundMask = args.backgroundMask;
    this.hook = { ...hook };
    Object.keys(hook).forEach((hook) => {
      if (args.hook && typeof args.hook[hook] === 'function') {
        this.on(hook, args.hook[hook]);
      }
    });
  }

  on(type: string, callback?: Function) {
    if (callback && Object.keys(hook).includes(type)) {
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

  onResize(e: Event) {
    [...this.frames].forEach((frame) => {
      frame.onResize(e);
    });
  }

  onBgclick(e: MouseEvent) {
    if (this.element && e.target instanceof Node && this.element.contains(e.target)) {
      this.hook.bgclick.forEach((event) => {
        event.apply(this, e);
      });
      /** 過程中拔除會再成無法正常迴圈，要另外建立陣列紀錄 **/
      [...this.frames].forEach((f) => {
        if (f.hook?.bgclick) {
          f.hook.bgclick.forEach((event) => {
            event.apply(f, e);
          });
        }
      });
    }
  }

  onDragstart(event: DragEvent, id: symbol, type: DragEventType) {
    const frame = this.getFrame(id);
    if (frame && event.dataTransfer) {
      this.focusFrame = frame;
      this.eventType = type;
    }
  }

  onTouchstart(event: TouchEvent, id: symbol, type: DragEventType) {
    const frame = this.getFrame(id);
    if (frame) {
      this.touches = Array.from(event.touches);
      this.focusFrame = frame;
      this.eventType = type;
    }
  }

  onDragover(event: DragEvent) {
    const frame = this.focusFrame;
    if (frame && frame.element) {
      const pos = {
        pageX: event.pageX,
        pageY: event.pageY,
      };
      if (this.eventType === DragEventType.DRAG_MOVE) {
        frame.onDragmove(pos);
      }
      if (
        this.eventType === DragEventType.RESIZE_TOP ||
        this.eventType === DragEventType.RESIZE_LEFT ||
        this.eventType === DragEventType.RESIZE_BOTTOM ||
        this.eventType === DragEventType.RESIZE_RIGHT
      ) {
        frame.onDragresize(pos, this.eventType);
      }

      frame.onDragover(event);
    }
  }

  onTouchmove(event: TouchEvent) {
    const frame = this.focusFrame;
    if (frame) {
      this.touches = Array.from(event.touches);
      if (this.eventType === DragEventType.DRAG_MOVE && this.touches.length === 1) {
        const touch = this.touches[0];
        frame.onDragmove({
          pageX: touch.pageX,
          pageY: touch.pageY,
        });
      }
      frame.onTouchmove(event);
    }
  }

  onDragend(event: DragEvent) {
    const frame = this.focusFrame;
    if (frame) {
      this.eventType = DragEventType.NORMAL;
      frame.mouseOffsetX = 0;
      frame.mouseOffsetY = 0;
      frame.onDragend(event);
    }
  }

  onTouchend(event: TouchEvent) {
    const frame = this.focusFrame;
    if (frame) {
      this.touches = Array.from(event.touches);
      if (this.touches.length === 0) {
        this.eventType = DragEventType.NORMAL;
        frame.mouseOffsetX = 0;
        frame.mouseOffsetY = 0;
      }
      frame.onTouchend(event);
    }
  }

  setRootElement<C = {}>(value: Element | C) {
    this.element = value instanceof Element ? value : null;
  }

  setFrameItemElement(index: number) {
    return (value: Element) => {
      this.frames[index].element = value;
    };
  }

  sortToRight(id: symbol) {
    const frame = this.getFrame(id);
    if (frame) {
      const indexOf = this.frames.map((p) => p.id).indexOf(frame.id);
      const frames = this.frames.splice(indexOf, 1);
      this.frames.push(...frames);
    }
  }

  openFrame<V>(view: (() => V) | Frame<V>, options?: OpenFrameOptions): Promise<Frame<V>> {
    return new Promise(async (resolve, reject) => {
      if (isFrame(view)) {
        view.close = resolve;
        view.onError = reject;
      }
      const frame = isFrame(view)
        ? view
        : createFrame<V>({
            ...options,
            view: await view(),
            close: resolve,
            onError: reject,
          });

      this.frames.push(frame);
    });
  }

  private async callbackCloseFrame(frames: Frame[], callback?: Function) {
    return await Promise.all(
      frames.map(async (f) => {
        const res = await f.onClose();
        if (callback) callback(res);
        return res;
      }),
    );
  }

  async closeFrame(arg?: unknown, callback?: Function) {
    type F = Frame;
    let frames: F[] = [];
    if (typeof arg === 'number') {
      const index = arg;
      frames = this.frames.slice(index, index + 1);
    } else if (isSymbol(arg)) {
      const id = arg;
      const indexOf = this.frames.map((f) => f.id).indexOf(id);
      frames = this.frames.slice(indexOf, indexOf + 1);
    } else if (typeof arg === 'object') {
      if (isFrame(arg)) {
        const target = arg;
        frames = this.frames.filter((f) => f.dialogId === target.dialogId);
      }
    } else if (typeof arg === 'function') {
      const func = arg as (f: F[]) => F[];
      frames = func(this.frames);
    } else {
      frames = this.frames.slice();
    }
    return await this.callbackCloseFrame(frames, callback);
  }

  getFrame(arg?: GetFrameParam) {
    if (typeof arg === 'object') {
      if (arg instanceof Frame) {
        return this.frames.find((f) => f.id === arg.id);
      }
    }
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
