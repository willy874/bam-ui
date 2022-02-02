import { ComponentOptionsBase, ComponentPublicInstance, DefineComponent, VNode } from 'vue';
import type Dialog from './dialog-class';
import type Frame from './frame-class';
export declare type AnyDefineComponent = DefineComponent<unknown, unknown, unknown, any, any, any, any, any, any, unknown, unknown, unknown> & {};
export declare type AnyComponentPublicInstance = ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>;
export interface FrameComponentProps<V = AnyDefineComponent> {
    dialog: Dialog;
    view: V;
    frame: Frame;
    zIndex: number;
}
export declare type FrameComponentInstance = ComponentPublicInstance & FrameComponentProps;
export declare type ViewComponentOption = AnyDefineComponent | VNode;
