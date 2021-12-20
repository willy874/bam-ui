import { FramePosition, FrameMethods, FrameData } from '../types';
import Frame from './frame';

export function getFrameMethods(frame: Frame): FrameMethods {
  return {
    setResizable: (bool: boolean) => frame.setResizable(bool),
    setDraggable: (bool: boolean) => frame.setDraggable(bool),
    setOverLimit: (bool: boolean) => frame.setOverLimit(bool),
    setPosition: (position: FramePosition) => frame.setPosition(position),
    setBoxSize: () => frame.setBoxSize(),
    on: (type: string, callback: Function) => frame.on(type, callback),
    off: (type: string, callback: Function) => frame.off(type, callback),
  };
}

export function getFrameData(frame: Frame): FrameData {
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
  };
}
