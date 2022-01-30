import Frame from './frame';
import { getViewportOffset, clearDragImage } from 'bam-utility-plugins';
import { createFrame } from './control';
import { isSymbol } from '/@/utils';
import { DragEventType } from '/@/enum';
import { DialogType } from '/#/dialog';

type GetFrameParam = Frame | number | symbol;

function isFrame<View = DialogType.BaseView>(f: unknown): f is Frame<View> {
  return f instanceof Frame;
}

const dialogHooks = 'mount,unmount,update,bgclick'.split(',');
export default class Dialog<View = DialogType.BaseView> implements DialogType.Dialog<View> {
  public readonly id: symbol;
  public readonly frames: Array<Frame<View>> = [];
  public readonly isBackgroundMask: boolean;
  public readonly backgroundMask: string;
  public focusFrame: Frame<View> | null = null;
  public eventType: DragEventType = DragEventType.NORMAL;
  public element: Element | null = null;
  public touches: Touch[] = [];
  public prevTouches: Touch[] = [];
  private hook: {
    [type: string]: Function[];
  };

  constructor(args: DialogType.DialogConstructor) {
    this.id = args.id;
    this.isBackgroundMask = args.isBackgroundMask;
    this.backgroundMask = args.backgroundMask;
    this.hook = {};
    dialogHooks.forEach((hook) => {
      this.hook[hook] = [];
      if (args.hook) {
        this.on(hook, args.hook[hook]);
      }
    });
  }

  setRootElement(value: Element) {
    this.frames.forEach((p) => {
      if (p instanceof Frame) {
      }
    });
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

  onDragstart(event: DragEvent, id: GetFrameParam, type: DragEventType) {
    const frame = this.getFrame(id);
    if (frame && frame.element && event.dataTransfer) {
      clearDragImage(event);
      this.focusFrame = frame;
      /** 紀錄滑鼠相對於視窗的座標 **/
      const viewPort = getViewportOffset(frame.element);
      frame.mouseOffsetX = event.pageX - viewPort.left;
      frame.mouseOffsetY = event.pageY - viewPort.top;
      this.eventType = type;
      frame.onDragstart(event);
    } else {
      console.warn('not element or event not dataTransfer target');
    }
  }

  onTouchstart(event: TouchEvent, id: GetFrameParam, type: DragEventType) {
    const frame = this.getFrame(id);
    if (frame) {
      this.touches = Array.from(event.touches);
      if (frame.element && type === DragEventType.DRAG_MOVE) {
        /** 觸控點相對於視窗的座標 **/
        const touch = this.touches[0];
        const viewPort = getViewportOffset(frame.element);
        frame.mouseOffsetX = touch.pageX - viewPort.left;
        frame.mouseOffsetY = touch.pageY - viewPort.top;
        this.focusFrame = frame;
        this.eventType = type;
      }
      frame.onTouchstart(event);
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

  openFrame<V = View>(frame: DialogType.OpenFrameOptions<V> | Frame<V>): Promise<Frame<V>> {
    return new Promise((resolve, reject) => {
      if (isFrame<View>(frame)) {
        frame.dialogId = this.id;
        frame.close = resolve;
        frame.onError = reject;
        this.frames.push(frame);
      } else {
        const target = frame as DialogType.OpenFrameOptions<V>;
        const newFrame = createFrame<V>({
          ...target,
          dialogId: Symbol('Frame'),
          close: resolve,
          onError: reject,
        });
        if (isFrame<View>(newFrame)) {
          this.frames.push(newFrame);
        }
      }
      try {
      } catch (error) {
        reject(error);
      }
    });
  }

  private async callbackCloseFrame(frames: Frame<View>[], callback?: Function) {
    return await Promise.all(
      frames.map(async (f) => {
        const res = await f.onClose();
        if (callback) callback(res);
        return res;
      }),
    );
  }

  async closeFrame(arg?: unknown, callback?: Function) {
    type F = Frame<View>;
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
