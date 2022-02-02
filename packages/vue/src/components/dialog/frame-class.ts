import { isVNode, h, VNode } from 'vue';
import { Dialog, Frame, FramePosition, getFrameData, getFrameMethods } from 'bam-ui/packages/core/src/index';
import css from '@bam-ui/core/dist/style.css';
import { useDialog } from './utils';

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
