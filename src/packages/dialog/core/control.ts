import Frame from './frame';
import Dialog from './dialog';
import { DialogType } from '/#/dialog';

const DialogCollection: { [key: symbol]: () => Dialog } = {};
const FrameCollection: { [key: symbol]: Frame } = {};

let getDefaultDialog: (() => Dialog) | null = null;

function useHandler(dialog: Dialog, callback?: Function) {
  const result = callback ? callback(dialog) : null;
  return result instanceof Dialog ? result : dialog;
}

export function createDialog<View = DialogType.BaseView>(
  options: DialogType.DialogOptions<View> = {},
  pluginHandler?: Function,
) {
  const dialog = new Dialog({
    id: typeof options.name === 'symbol' ? options.name : Symbol(options.name),
    hook: options.hook || {},
    isBackgroundMask: options.isBackgroundMask === false ? false : true,
    backgroundMask: options.backgroundMask || 'transparent',
  });
  DialogCollection[dialog.id] = () => useHandler(dialog, pluginHandler);
  if (!getDefaultDialog) {
    getDefaultDialog = () => useHandler(dialog, pluginHandler);
  }
  return dialog;
}

export function useDialog<View = DialogType.BaseView>(id?: symbol) {
  if (!getDefaultDialog) {
    throw new Error('not created dialog');
  }
  const getDialog = (id && DialogCollection[id]) || getDefaultDialog;
  return getDialog() as Dialog<View>;
}

export function createFrame<View>(options: DialogType.FrameOptions<View>): Frame<View> {
  const frame = new Frame<View>(options);
  FrameCollection[frame.id] = frame;
  return frame;
}

export function useFrame<View>(id: symbol) {
  const frame = FrameCollection[id];
  return frame as Frame<View>;
}
