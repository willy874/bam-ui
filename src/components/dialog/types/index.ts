export interface DialogHookParam {
  mount: Function;
  unmount: Function;
  update: Function;
  resize: Function;
}

export interface DialogOptions {
  id?: symbol;
  zIndex?: {
    [name: string]: number;
  };
  hook?: DialogHookParam;
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
}
