import { reactive } from 'vue';
import type { ViewComponentOption } from './types';
import { createDialog as _createDialog, useDialog as _useDialog, useFrame as _useFrame } from '../core/control';
import { DialogType } from '/#/dialog';

export function createDialog<View = ViewComponentOption>(options: DialogType.DialogOptions<View>) {
  const dialog = _createDialog<View>(options, (dialog) => reactive(dialog));
  return dialog;
}

export function useDialog<View = ViewComponentOption>(id?: symbol) {
  return reactive(_useDialog<View>(id));
}

export function useFrame<View = ViewComponentOption>(id: symbol, proxy: boolean = true) {
  const frame = _useFrame<View>(id);
  return proxy ? reactive(frame) : frame;
}
