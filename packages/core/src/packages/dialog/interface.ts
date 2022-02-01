import Frame from './frame';

export function getFrameMethods(frame: Frame) {
  return {
    setResizable: (bool: boolean) => frame.setResizable(bool),
    setDraggable: (bool: boolean) => frame.setDraggable(bool),
    setOverLimit: (bool: boolean) => frame.setOverLimit(bool),
    setFull: (bool: boolean) => frame.setFull(bool),
    setPosition: (...args: Parameters<typeof frame.setPosition>) => frame.setPosition(...args),
    setBoxSize: () => frame.setBoxSize(),
    on: (type: string, callback: Function) => frame.on(type, callback),
    off: (type: string, callback: Function) => frame.off(type, callback),
  };
}

export type FrameMethods = ReturnType<typeof getFrameMethods>;

export function getFrameData(frame: Frame) {
  return {
    id: frame.id,
    dialogId: frame.dialogId,
    element: frame.element,
    top: frame.top,
    left: frame.left,
    width: frame.width,
    height: frame.height,
    mouseOffsetX: frame.mouseOffsetX,
    mouseOffsetY: frame.mouseOffsetY,
    isOverLimit: frame.isOverLimit,
    isDraggable: frame.isDraggable,
    isResizable: frame.isResizable,
    isFull: frame.isFull,
  };
}

export type FrameData = ReturnType<typeof getFrameData>;
