declare namespace DialogInterface {
  class Dialog<View> {
    frames: Array<Frame<ValueOf<View>>>;
    constructor(args: DialogConstructor);
    setRootElement(value: Element): void;
  }

  interface DialogConstructor {
    id: symbol;
    hook: DialogHookParam;
    isBackgroundMask: boolean;
    backgroundMask: string;
  }

  interface DialogOptions {
    name: number | string | symbol;
    hook?: DialogHookParam;
    isBackgroundMask?: boolean;
    backgroundMask?: string;
  }

  type DialogHooks = 'mount' | 'unmount' | 'update' | 'bgclick';

  interface DialogHookParam {
    [key: DialogHooks]: Function;
  }

  class Frame<View = {}> {
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
    mouseOffsetX = 0;
    mouseOffsetY = 0;
    close: Function | null;
    onError: Function;
    hook: FrameHook;
    resizeObserver: ResizeObserver | null;
    isDragged: boolean;
    isResized: boolean;
    dialogPadding: number;
    constructor();
    onResize(event: Event);
    onDragstart(event: DragEvent);
    onDragmove(event: PagePosition);
    onDragresize(event: PagePosition, type?: EventType);
    onDragover(event: DragEvent);
    onDragend(event: DragEvent);
    onTouchstart(event: TouchEvent);
    onTouchmove(event: TouchEvent, type?: EventType);
    onTouchend(event: TouchEvent);
    onClose(event: Dialog);
  }

  interface OpenFrameOptions<View = {}> {
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

  interface FrameOptions<View = {}> extends OpenFrameOptions<View> {
    dialogId: symbol;
    close: Function;
    onError: Function;
    position?: FramePosition;
  }

  interface FrameHook {
    [key: string]: Function[];
  }

  interface FrameCollection {
    [key: string | number | symbol]: Frame;
  }

  interface PagePosition {
    pageX: number;
    pageY: number;
  }

  enum EventType {
    NORMAL = 0,
    DRAG_MOVE = 1,
    RESIZE_TOP = 2,
    RESIZE_LEFT = 3,
    RESIZE_BOTTOM = 4,
    RESIZE_RIGHT = 5,
  }
}
