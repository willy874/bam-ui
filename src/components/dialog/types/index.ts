export interface DialogHookParam {
  mount: Function;
  unmount: Function;
  update: Function;
  bgclick: Function;
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
  bgclick?: Function;
  dragstart?: Function;
  dragover?: Function;
  dragend?: Function;
  touchstart?: Function;
  touchmove?: Function;
  touchend?: Function;
}

export type FramePosition = 'auto' | 'center' | { top: number | string; left: number | string };

export interface OpenFrameOptions {
  view: object;
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

export interface PagePosition {
  pageX: number;
  pageY: number;
}

export interface FrameMethods {
  setResizable: (bool: boolean) => unknown;
  setDraggable: (bool: boolean) => unknown;
  setOverLimit: (bool: boolean) => unknown;
  setFull: (bool: boolean) => unknown;
  setPosition: (position: FramePosition) => unknown;
  setBoxSize: () => unknown;
  on: (type: string, callback: Function) => unknown;
  off: (type: string, callback: Function) => unknown;
}

export interface FrameData {
  id: symbol;
  dialogId: symbol;
  element: Element | null;
  top: string;
  left: string;
  width: string | number;
  height: string | number;
  mouseOffsetX: number;
  mouseOffsetY: number;
  isOverLimit: boolean;
  isDraggable: boolean;
  isResizable: boolean;
  isFull: boolean;
}
