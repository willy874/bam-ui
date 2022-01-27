import type { FrameOptions } from '../types';
import Frame from './frame';
import Dialog from './dialog';

const dialogList: { [key: symbol]: Dialog } = {};
const dialogIdList = new Set<symbol>();
let dialogSymbol = Symbol('dialog');

export function createDialog<VC>(options: DialogInterface.DialogOptions) {
  return new Dialog<VC>({
    id: typeof options.name === 'symbol' ? options.name : Symbol(options.name),
    hook: options.hook || {},
    isBackgroundMask: options.isBackgroundMask === false ? false : true,
    backgroundMask: options.backgroundMask || 'transparent',
  });
}
const frameCollections = {
  frameTest_1: { name1: 'd1' },
  frameTest_2: { name2: 'd2' },
  frameTest_3: { name3: 'd3' },
  frameTest_4: { name4: 'd4' },
  frameTest_5: { name5: 'd5' },
};
const dia = createDialog<typeof frameCollections>({
  name: 'dia',
});
dia.frames.map((f) => {
  f.view;
});

export function useDialog(id?: symbol) {
  const dialog = dialogList[id || dialogSymbol];
  return dialog;
}

export function createFrame<View>(options: FrameOptions<View>): Frame<View> {
  const frame = new Frame<View>(options);
  return frame;
}

export function useFrame(id: symbol) {
  const cache: DialogInterface.Frame[] = [];
  dialogIdList.forEach((dialogId) => {
    cache.push(...dialogList[dialogId].frames);
  });
  return cache.find((f) => f.id === id) || null;
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
