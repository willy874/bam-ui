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

export type FramePosition = 'default' | 'center' | { top: number | string; left: number | string };

export interface OpenFrameOptions {
  view: object;
  props?: object;
  hook?: FrameHookParam;
  position?: FramePosition;
}

export interface FrameOptions extends OpenFrameOptions {
  dialogId: symbol;
  close: Function;
  onError: Function;
  position?: FramePosition;
  isOverLimit?: boolean;
}

export enum EventType {
  NORMAL = 0,
  DRAG_MOVE = 1,
  RESIZE = 2,
}
