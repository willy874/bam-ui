import type { DialogOptions, FrameOptions } from '../types';
import Frame from './frame';
import Dialog from './dialog';

const dialogList: { [key: symbol]: Dialog } = {};
const dialogIdList = new Set<symbol>();
let dialogSymbol = Symbol('dialog');

export function createDialog(options: DialogOptions) {
  const dialog = new Dialog(options);
  dialogSymbol = dialog.id;
  dialogIdList.add(dialogSymbol);
  dialogList[dialogSymbol] = dialog;
  return dialog;
}

export function useDialog(id?: symbol) {
  const dialog = dialogList[id || dialogSymbol];
  return dialog;
}

export function createFrame(options: FrameOptions) {
  const frame = new Frame(options);
  return frame;
}

export function useFrame(id: symbol) {
  const cache: Frame[] = [];
  dialogIdList.forEach((dialogId) => {
    cache.push(...dialogList[dialogId].frames);
  });
  return cache.find((f) => f.id === id);
}

let lastRenderDialogId: symbol;
export function useDialogRender(id?: symbol) {
  if (id) {
    lastRenderDialogId = id;
    return null;
  } else {
    return useDialog(lastRenderDialogId);
  }
}

let lastRenderFrameId: symbol;
export function useFrameRender(id?: symbol) {
  if (id) {
    lastRenderFrameId = id;
    return null;
  } else {
    return useFrame(lastRenderFrameId);
  }
}
