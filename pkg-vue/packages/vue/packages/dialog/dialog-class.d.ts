import { Dialog, OpenFrameOptions } from '../../../core/packages';
import VueFrame from './frame-class';
declare type GetFrameParam = VueFrame | number | symbol;
export default class VueDialog extends Dialog {
    tag: string;
    readonly frames: Array<VueFrame>;
    focusFrame: VueFrame | null;
    constructor(args: any);
    getFrame(arg?: GetFrameParam): import('../../../core/packages').Frame<any> | undefined;
    openFrame<V = any>(view: (() => V) | VueFrame, options?: OpenFrameOptions): Promise<VueFrame>;
}
export {};
