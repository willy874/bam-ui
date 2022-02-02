import { Dialog, OpenFrameOptions } from '@core/packages';
import { createFrame, isFrame } from './utils';
import VueFrame from './frame-class';

type GetFrameParam = VueFrame | number | symbol;

export default class VueDialog extends Dialog {
  tag = 'vue';

  public readonly frames: Array<VueFrame> = [];
  public focusFrame: VueFrame | null = null;

  constructor(args) {
    super(args);
  }

  getFrame(arg?: GetFrameParam) {
    return this._getFrame(arg);
  }

  openFrame<V = any>(view: (() => V) | VueFrame, options?: OpenFrameOptions): Promise<VueFrame> {
    return new Promise(async (resolve, reject) => {
      if (isFrame(view)) {
        view.close = resolve;
        view.onError = reject;
      }
      const frame = isFrame(view)
        ? view
        : createFrame<V>({
            ...options,
            view: await view(),
            close: resolve,
            onError: reject,
          });

      this.frames.push(frame);
    });
  }
}
