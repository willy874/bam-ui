import type { DialogOptions, FrameOptions } from '@core/packages';
import { reactive, UnwrapNestedRefs } from 'vue';
import VueDialog from './dialog-class';
import VueFrame from './frame-class';

const DialogCollection: { [key: symbol]: () => UnwrapNestedRefs<VueDialog> } = {};
const FrameCollection: { [key: symbol]: () => VueFrame } = {};

const defaultDialogRef: {
  get: (() => UnwrapNestedRefs<VueDialog>) | null;
} = {
  get: null,
};

export function createDialog(options: DialogOptions = {}) {
  const dialog = new VueDialog({
    id: typeof options.name === 'symbol' ? options.name : Symbol(options.name),
    hook: options.hook || {},
    isBackgroundMask: options.isBackgroundMask === false ? false : true,
    backgroundMask: options.backgroundMask || 'transparent',
  });
  const getDialog = () => reactive(dialog);
  DialogCollection[dialog.id] = getDialog;
  if (!defaultDialogRef.get) {
    defaultDialogRef.get = getDialog;
  }
  return dialog;
}

export function setDefaultDialog(dialog: VueDialog) {
  const getDialog = () => reactive(dialog);
  DialogCollection[dialog.id] = getDialog;
  defaultDialogRef.get = getDialog;
  return getDialog();
}

export function useDialog(id?: symbol): UnwrapNestedRefs<VueDialog> {
  if (!defaultDialogRef.get) {
    throw new Error('not created dialog');
  }
  const getDialog = (id && DialogCollection[id]) || defaultDialogRef.get;
  return getDialog();
}

export function useFrame<V>(id: symbol): VueFrame<V> {
  const getFrame = FrameCollection[id];
  return getFrame() as VueFrame<V>;
}

export function createFrame<V>(options: FrameOptions<V>): VueFrame<V> {
  const frame = new VueFrame<V>({
    ...options,
    dialogId: options.name ? Symbol(options.name) : Symbol('Frame'),
  });
  FrameCollection[frame.id] = () => frame;
  return frame;
}

export function isFrame<V>(f: unknown): f is VueFrame<V> {
  return typeof f === 'object' && f instanceof VueFrame;
}
