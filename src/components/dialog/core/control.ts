import type { DialogOptions } from '../types';
import Dialog from './dialog';

const dialogList: { [key: symbol]: Dialog } = {};
let dialogSymbol = Symbol('dialog');

export function create(options: DialogOptions) {
  const dialog = new Dialog(options);
  dialogSymbol = dialog.id;
  dialogList[dialogSymbol] = dialog;
  return dialog;
}

export function use(id?: symbol) {
  const target = dialogList[id || dialogSymbol];
  return target;
}
