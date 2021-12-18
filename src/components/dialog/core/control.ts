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

/**
 * 渲染順序
 */
// type DialogRender = Dialog | Frame;
// const dialogRenderList: DialogRender[] = [];
// const renderCache: DialogRender[] = [];
// let isSetup = false;
// let renderIndex = 0;
// export function useRender(entity: Dialog | Frame) {
//   if (isSetup) {
//     const indexOf = dialogRenderList.indexOf(entity);
//     if (indexOf > -1) {
//       // Includes
//       renderIndex = indexOf;
//       if (renderIndex === 0) {
//         // First
//         renderCache.splice(0);
//       } else if (renderIndex === dialogRenderList.length - 1) {
//         // Last
//         const insertList = dialogRenderList.filter((p) => !renderCache.includes(p));
//         insertList.forEach((target) => {
//           const index = dialogRenderList.indexOf(target);
//           dialogRenderList.splice(index, 1);
//         });
//       }
//     } else {
//       // Empty
//       dialogRenderList.splice(renderIndex, 0, entity);
//     }
//   } else {
//     isSetup = true;
//     dialogRenderList.push(entity);
//   }
// }
