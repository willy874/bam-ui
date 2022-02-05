import type { DialogOptions, FrameOptions, OpenFrameOptions } from './types';
import Frame from './frame';
import Dialog from './dialog';

function useDialogHandler(dialog: Dialog, callback?: Function) {
  const result = callback ? callback(dialog) : null;
  return result instanceof Dialog ? result : dialog;
}

function useFrameHandler(frame: Frame, callback?: Function) {
  const result = callback ? callback(frame) : null;
  return result instanceof Frame ? result : frame;
}

export interface UtilsInterface<D = Dialog, F = Frame> {
  dialogCollection: {
    [key: symbol]: () => D;
  };
  frameCollection: {
    [key: symbol]: () => F;
  };
  defaultDialogRef: {
    get: (() => D) | null;
  };
  useDialogHandler(dialog: D, callback?: Function): D;
  useFrameHandler(frame: F, callback?: Function): F;
  createDialog(options: DialogOptions, pluginHandler?: Function): D;
  useDialog(id?: symbol): D;
  setDefaultDialog(dialog: D): D;
  createFrame<V>(options: FrameOptions<V>, pluginHandler?: Function): Frame<V>;
  openFrame<V>(view: (() => V) | Frame<V>, options?: OpenFrameOptions): Promise<Frame<V>>;
  useFrame<V>(id: symbol): Frame<V>;
  isDialog(d: unknown): d is D;
  isFrame(f: unknown): f is F;
}

export const utils: UtilsInterface = {
  dialogCollection: {},
  frameCollection: {},
  defaultDialogRef: {
    get: null,
  },
  useDialogHandler(dialog, callback) {
    const result = callback ? callback(dialog) : null;
    return result instanceof Dialog ? result : dialog;
  },
  useFrameHandler(frame, callback) {
    const result = callback ? callback(frame) : null;
    return result instanceof Frame ? result : frame;
  },
  createDialog(options = {}, pluginHandler) {
    const dialog = new Dialog({
      id: typeof options.name === 'symbol' ? options.name : Symbol(options.name),
      hook: options.hook || {},
      isBackgroundMask: options.isBackgroundMask === false ? false : true,
      backgroundMask: options.backgroundMask || 'transparent',
    });
    const getDialog = () => useDialogHandler(dialog, pluginHandler);
    this.dialogCollection[dialog.id] = getDialog;
    if (!this.defaultDialogRef.get) {
      this.defaultDialogRef.get = getDialog;
    }
    return dialog;
  },
  useDialog(id) {
    if (!this.defaultDialogRef.get) {
      throw new Error('not created dialog');
    }
    const getDialog = (id && this.dialogCollection[id]) || this.defaultDialogRef.get;
    return getDialog() as Dialog;
  },
  setDefaultDialog(dialog: Dialog) {
    const getDialog = () => dialog;
    this.dialogCollection[dialog.id] = getDialog;
    this.defaultDialogRef.get = getDialog;
    return getDialog();
  },
  createFrame(options, pluginHandler) {
    const id = options.name ? Symbol(options.name) : Symbol('Frame');
    const frame = new Frame({
      ...options,
      id: typeof options.id === 'symbol' ? options.dialogId : id,
      dialogId: useDialog(options.dialogId).id,
    });
    this.frameCollection[frame.id] = () => useFrameHandler(frame, pluginHandler);
    return frame;
  },
  openFrame<V>(view, options) {
    const dialog = useDialog();
    return dialog.openFrame<V>(view, options);
  },
  useFrame<V>(id) {
    const getFrame = this.frameCollection[id];
    return getFrame() as Frame<V>;
  },
  isDialog(f): f is Dialog {
    return typeof f === 'object' && f instanceof Dialog;
  },
  isFrame(f): f is Frame {
    return typeof f === 'object' && f instanceof Frame;
  },
};

export const createDialog: UtilsInterface['createDialog'] = (o, p) => utils.createDialog(o, p);

export const useDialog: UtilsInterface['useDialog'] = (id) => utils.useDialog(id);

export const setDefaultDialog: UtilsInterface['setDefaultDialog'] = (d) => utils.setDefaultDialog(d);

export const createFrame: UtilsInterface['createFrame'] = (o, p) => utils.createFrame(o, p);

export const openFrame: UtilsInterface['openFrame'] = (v, o) => utils.openFrame(v, o);

export const useFrame: UtilsInterface['useFrame'] = (id) => utils.useFrame(id);

export const isDialog: UtilsInterface['isDialog'] = utils.isDialog;

export const isFrame: UtilsInterface['isFrame'] = utils.isFrame;
