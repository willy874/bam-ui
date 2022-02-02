import { VNode } from 'vue';
import { Frame, FramePosition } from '../../../core/packages';
export default class VueFrame<View = any> extends Frame<VNode | View> {
    tag: string;
    constructor(args: any);
    setPosition(position: FramePosition): void;
    onClose(): Promise<Frame<any>>;
    createVNode(): VNode;
}
