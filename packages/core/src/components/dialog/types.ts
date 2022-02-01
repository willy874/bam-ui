export interface DialogConstructor {
  id: symbol;
  hook: DialogHookParam;
  isBackgroundMask: boolean;
  backgroundMask: string;
}

export interface DialogOptions {
  name?: number | string | symbol;
  hook?: DialogHookParam;
  isBackgroundMask?: boolean;
  backgroundMask?: string;
}

export interface DialogHookParam {
  mount?: Function;
  unmount?: Function;
  update?: Function;
  bgclick?: Function;
}

export type DialogHooks = keyof DialogHookParam & string;

export type DialogHookProperty = { [K in DialogHooks]: Function[] };

export interface OpenFrameOptions {
  name?: string;
  props?: object;
  hook?: FrameHookParam;
  isOverLimit?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  isFull?: boolean;
  width?: string;
  height?: string;
  position?: FramePosition;
}

export interface FrameOptions<V = any> extends OpenFrameOptions {
  view: V;
  close: Function;
  onError: Function;
}

export interface FrameConstructor<V> extends FrameOptions<V> {
  dialogId: symbol;
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
export type FrameHooks = keyof FrameHookParam & string;

export type FrameHookProperty = { [K in FrameHooks]: Function[] };

export interface PagePosition {
  pageX: number;
  pageY: number;
}

export type FramePosition = 'auto' | 'center' | { top: number | string; left: number | string };

export type BaseView = {} | Function | (new (...arg: any) => any) | string | { [key: string | symbol]: any };
