import { isVNode, reactive, toRaw, VNode, h } from 'vue';
import { utils, Dialog, Frame, getFrameData, getFrameMethods } from '@core/packages';
import { getClassNames as css } from '@core/style';

utils.createDialog = function (options = {}) {
  console.log(this);

  const dialog = new Dialog({
    id: typeof options.name === 'symbol' ? options.name : Symbol(options.name),
    hook: options.hook || {},
    isBackgroundMask: options.isBackgroundMask === false ? false : true,
    backgroundMask: options.backgroundMask || 'transparent',
  });
  const getDialog = () => reactive(dialog);
  this.dialogCollection[dialog.id] = getDialog;
  if (!this.defaultDialogRef.get) {
    this.defaultDialogRef.get = getDialog;
  }
  return dialog;
};

export const createDialog = utils.createDialog.bind(utils);

utils.setDefaultDialog = function (dialog) {
  const getDialog = () => reactive(dialog);
  this.dialogCollection[dialog.id] = getDialog;
  this.defaultDialogRef.get = getDialog;
  return getDialog() as Dialog;
};

export const setDefaultDialog = utils.setDefaultDialog.bind(utils);

export const useDialog = utils.useDialog.bind(utils);

export const useFrame = utils.useFrame.bind(utils);

export const createFrame = utils.createFrame.bind(utils);

export const openFrame = utils.openFrame.bind(utils);

export const isDialog = utils.isDialog.bind(utils);

export const isFrame = utils.isFrame.bind(utils);

export function createVNode(frame: Frame): VNode {
  const f = toRaw(frame);
  if (isVNode(f.view)) {
    return f.view;
  } else {
    return h(f.view, {
      class: css().dialog_view,
      frameData: getFrameData(f),
      frameMethods: getFrameMethods(f),
      frameProps: f.props,
    });
  }
}
