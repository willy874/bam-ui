import type { FramePosition } from '../core/types';
import { isVNode, h, VNode } from 'vue';
import Dialog from '../core/dialog';
import Frame from '../core/frame';
import { useDialog } from './utils';
import css from '/@/style';
import { getFrameData, getFrameMethods } from '../core/interface';

export default class VueFrame<View = any> extends Frame<VNode | View> {
  tag = 'vue';

  constructor(args) {
    super(args);
  }

  setPosition(position: FramePosition) {
    const dialog = useDialog(this.dialogId);
    this._setPosition(position, dialog as unknown as Dialog);
  }

  onClose() {
    const dialog = useDialog(this.dialogId);
    return this._onClose(dialog as unknown as Dialog);
  }

  createVNode(): VNode {
    if (isVNode(this.view)) {
      return this.view;
    } else {
      return h(this.view, {
        class: css.dialog_view,
        frameData: getFrameData(this),
        frameMethods: getFrameMethods(this),
        frameProps: this.props,
      });
    }
  }
}
