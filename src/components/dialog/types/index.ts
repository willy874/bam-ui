export interface DialogHookParam {
  mount: Function;
  unmount: Function;
  update: Function;
  resize: Function;
}

export interface DialogOptions {
  id?: symbol;
  hook?: DialogHookParam;
  isBackgroundMask?: boolean;
}

export interface FrameHookParam {
  mount?: Function;
  unmount?: Function;
  update?: Function;
  bgClick?: Function;
  dragstart?: Function;
  touchstart?: Function;
}

export type FramePosition = 'auto' | 'center' | { top: number | string; left: number | string };

export interface OpenFrameOptions {
  view: object;
  props?: object;
  hook?: FrameHookParam;
  position?: FramePosition;
  isOverLimit?: boolean;
  isDraggable?: boolean;
  isResize?: boolean;
}

export interface FrameOptions extends OpenFrameOptions {
  dialogId: symbol;
  close: Function;
  onError: Function;
  position?: FramePosition;
}

export enum EventType {
  NORMAL = 0,
  DRAG_MOVE = 1,
  RESIZE_TOP = 2,
  RESIZE_LEFT = 3,
  RESIZE_BOTTOM = 4,
  RESIZE_RIGHT = 5,
}
