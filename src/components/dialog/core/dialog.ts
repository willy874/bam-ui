import { DialogOptions, OpenFrameOptions, EventType } from '../types';
import { DialogDragEvent, DialogTouchEvent } from './event';
import Frame from './frame';
import { getViewportOffset, clearDragImage } from '../utils';
import { createFrame } from './control';

type GetFrameParam = Frame | number | symbol;

const dialogHooks = 'mount,unmount,update,bgclick'.split(',');

export default class Dialog {
  public readonly id: symbol;
  public readonly frames: Frame[] = [];
  public focusFrame: Frame | null = null;
  public eventType: EventType = EventType.NORMAL;
  public element: Element | null = null;
  public touches: Touch[] = [];
  public isBackgroundMask: boolean;
  private hook: {
    [type: string]: Function[];
  };

  constructor(args: DialogOptions) {
    this.id = args.id || Symbol('Dialog');
    this.isBackgroundMask = args.isBackgroundMask === false ? false : true;
    this.hook = {};
    dialogHooks.forEach((hook) => {
      this.hook[hook] = [];
      if (args.hook) {
        this.on(hook, args.hook[hook]);
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

  sortToRight(id: GetFrameParam) {
    const frame = this.getFrame(id);
    if (frame) {
      const indexOf = this.frames.map((p) => p.id).indexOf(frame.id);
      const frames = this.frames.splice(indexOf, 1);
      this.frames.push(...frames);
    }
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

  onBgclick(e: PointerEvent) {
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

  onDragstart(event: DragEvent, id: GetFrameParam, type: EventType) {
    const frame = this.getFrame(id);
    if (frame && frame.element && event.dataTransfer) {
      clearDragImage(event);
      this.focusFrame = frame;
      this.eventType = type;
      /** 紀錄滑鼠相對於視窗的座標 **/
      const viewPort = getViewportOffset(frame.element);
      frame.mouseOffsetX = event.pageX - viewPort.left;
      frame.mouseOffsetY = event.pageY - viewPort.top;
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

  onTouchstart(event: TouchEvent, id: GetFrameParam, type: EventType) {
    const frame = this.getFrame(id);
    if (frame) {
      this.touches = Array.from(event.touches);
      /** 單一觸控點時 **/
      if (frame.element && type === EventType.DRAG_MOVE) {
        /** 觸控點相對於視窗的座標 **/
        const touch = this.touches[0];
        const viewPort = getViewportOffset(frame.element);
        frame.mouseOffsetX = touch.pageX - viewPort.left;
        frame.mouseOffsetY = touch.pageY - viewPort.top;
        this.focusFrame = frame;
        this.eventType = type;
      }
      frame.onTouchstart(
        new DialogTouchEvent({
          event,
          dialog: this,
          frame: frame,
        }),
      );
    }
  }

  onDragover(event: DragEvent) {
    const frame = this.focusFrame;
    if (frame) {
      const pos = {
        pageX: event.pageX,
        pageY: event.pageY,
      };
      if (this.eventType === EventType.DRAG_MOVE) {
        frame.onDragmove(pos);
      }
      if (
        this.eventType === EventType.RESIZE_TOP ||
        this.eventType === EventType.RESIZE_LEFT ||
        this.eventType === EventType.RESIZE_BOTTOM ||
        this.eventType === EventType.RESIZE_RIGHT
      ) {
        frame.onDragresize(pos, this.eventType);
      }

      frame.onDragover(
        new DialogDragEvent({
          event,
          dialog: this,
          frame: frame,
        }),
      );
    }
  }

  onTouchmove(event: TouchEvent) {
    const frame = this.focusFrame;
    if (frame) {
      this.touches = Array.from(event.touches);
      if (this.eventType === EventType.DRAG_MOVE && this.touches.length === 1) {
        const touch = this.touches[0];
        frame.onDragmove({
          pageX: touch.pageX,
          pageY: touch.pageY,
        });
      }
      frame.onTouchmove(
        new DialogTouchEvent({
          event,
          dialog: this,
          frame: frame,
        }),
      );
    }
  }

  onDragend(event: DragEvent) {
    const frame = this.focusFrame;
    if (frame) {
      this.eventType = EventType.NORMAL;
      frame.mouseOffsetX = 0;
      frame.mouseOffsetY = 0;
      frame.onDragend(
        new DialogDragEvent({
          event,
          dialog: this,
          frame: frame,
        }),
      );
    }
  }

  onTouchend(event: TouchEvent) {
    const frame = this.focusFrame;
    if (frame) {
      this.touches = Array.from(event.touches);
      if (this.touches.length === 0) {
        this.eventType = EventType.NORMAL;
        frame.mouseOffsetX = 0;
        frame.mouseOffsetY = 0;
      }
      frame.onTouchend(
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
          const target = createFrame({
            dialogId: this.id || Symbol('Frame'),
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

  getFrame(arg?: GetFrameParam) {
    if (arg instanceof Frame) {
      return this.frames.find((f) => f === arg);
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
