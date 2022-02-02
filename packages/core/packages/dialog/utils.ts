import type { DialogOptions, FrameOptions, OpenFrameOptions } from './types';
import Frame from './frame';
import Dialog from './dialog';

const DialogCollection: { [key: symbol]: () => Dialog } = {};
const FrameCollection: { [key: symbol]: () => Frame } = {};

const defaultDialogRef: {
  get: (() => Dialog) | null;
} = {
  get: null,
};

function useDialogHandler(dialog: Dialog, callback?: Function) {
  const result = callback ? callback(dialog) : null;
  return result instanceof Dialog ? result : dialog;
}
function useFrameHandler(frame: Frame, callback?: Function) {
  const result = callback ? callback(frame) : null;
  return result instanceof Frame ? result : frame;
}

export function createDialog(options: DialogOptions = {}, pluginHandler?: Function) {
  const dialog = new Dialog({
    id: typeof options.name === 'symbol' ? options.name : Symbol(options.name),
    hook: options.hook || {},
    isBackgroundMask: options.isBackgroundMask === false ? false : true,
    backgroundMask: options.backgroundMask || 'transparent',
  });
  const getDialog = () => useDialogHandler(dialog, pluginHandler);
  DialogCollection[dialog.id] = getDialog;
  if (!defaultDialogRef.get) {
    defaultDialogRef.get = getDialog;
  }
  return dialog;
}

export function useDialog(id?: symbol) {
  if (!defaultDialogRef.get) {
    throw new Error('not created dialog');
  }
  const getDialog = (id && DialogCollection[id]) || defaultDialogRef.get;
  return getDialog() as Dialog;
}

export function createFrame<V>(options: FrameOptions<V>, pluginHandler?: Function): Frame<V> {
  const frame = new Frame<V>({
    ...options,
    dialogId: options.name ? Symbol(options.name) : Symbol('Frame'),
  });
  FrameCollection[frame.id] = () => useFrameHandler(frame, pluginHandler);
  return frame;
}

export function openFrame<V>(view: (() => V) | Frame<V>, options?: OpenFrameOptions): Promise<Frame<V>> {
  const dialog = useDialog();
  return dialog.openFrame<V>(view, options);
}

export function useFrame<V>(id: symbol) {
  const getFrame = FrameCollection[id];
  return getFrame() as Frame<V>;
}

export function isFrame<V>(f: unknown): f is Frame<V> {
  return typeof f === 'object' && f instanceof Frame;
}
