declare namespace DialogInterface {
  class Dialog<View = BaseView> {
    id: symbol;
    frames: Array<Frame<View>>;
    isBackgroundMask: boolean;
    backgroundMask: string;
    focusFrame: Frame<View> | null;
    eventType: number;
    element: Element | null;
    touches: Touch[];
    prevTouches: Touch[];
    constructor(args: DialogConstructor);
    setRootElement(value: Element): void;
  }

  interface DialogConstructor {
    id: symbol;
    hook: DialogHookParam;
    isBackgroundMask: boolean;
    backgroundMask: string;
  }

  interface DialogOptions<View = BaseView> {
    name?: number | string | symbol;
    hook?: DialogHookParam;
    isBackgroundMask?: boolean;
    backgroundMask?: string;
  }

  interface DialogHookParam {
    mount?: Function;
    unmount?: Function;
    update?: Function;
    bgclick?: Function;
  }

  type DialogHooks = keyof DialogHookParam & string;

  class Frame<View = BaseView> {
    id: symbol;
    dialogId: symbol;
    view: View;
    props: object;
    isOverLimit: boolean;
    isDraggable: boolean;
    isResizable: boolean;
    isFull: boolean;
    position: FramePosition;
    element: Element | null;
    top: string;
    left: string;
    width: string | number;
    height: string | number;
    mouseOffsetY: number;
    close: Function | null;
    onError: Function;
    resizeObserver: ResizeObserver | null;
    isDragged: boolean;
    isResized: boolean;
    dialogPadding: number;
    constructor();
    onResize(event: Event);
    onDragstart(event: DragEvent);
    onDragmove(event: PagePosition);
    onDragresize(event: PagePosition, type?: number);
    onDragover(event: DragEvent);
    onDragend(event: DragEvent);
    onTouchstart(event: TouchEvent);
    onTouchmove(event: TouchEvent, type?: number);
    onTouchend(event: TouchEvent);
    onClose(event: Dialog);
  }

  interface OpenFrameOptions<View = BaseView> {
    view: View;
    props?: object;
    hook?: FrameHookParam;
    position?: FramePosition;
    isOverLimit?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    isFull?: boolean;
    width?: string;
    height?: string;
  }

  interface FrameOptions<View = BaseView> extends OpenFrameOptions<View> {
    dialogId: symbol;
    close: Function;
    onError: Function;
    position?: FramePosition;
  }

  interface FrameConstructor<View = BaseView> extends OpenFrameOptions<View> {
    dialogId: symbol;
    close: Function;
    onError: Function;
    position?: FramePosition;
  }

  interface FrameHookParam {
    mount?: Function;
    unmount?: Function;
    update?: Function;
    bgclick?: Function;
    dragstart?: Function;
    dragover?: Function;
    dragend?: Function;
    touchstart?: Function;
    touchmove?: Function;
    touchend?: Function;
  }

  type FrameHook = keyof FrameHookParam & string;

  interface FrameCollection {
    [key: string | number | symbol]: Frame;
  }

  interface PagePosition {
    pageX: number;
    pageY: number;
  }

  type FramePosition = 'auto' | 'center' | { top: number | string; left: number | string };

  interface FrameOptions<View = BaseView> extends OpenFrameOptions<View> {
    dialogId: symbol;
    close: Function;
    onError: Function;
    position?: FramePosition;
  }

  type BaseView = {} | Function | (new (...arg: any) => any) | string | { [key: string | symbol]: any };
}
