import { VNode, DefineComponent, PropType } from 'vue';
import DialogClass from './dialog-class';
import FrameClass from './frame-class';
declare const _default: DefineComponent<{
    dialog: {
        type: PropType<DialogClass>;
        required: true;
    };
    view: {
        type: PropType<VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | DefineComponent<{}, {}, {}, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        required: true;
    };
    frame: {
        type: PropType<FrameClass<any>>;
        required: true;
    };
    zIndex: {
        type: NumberConstructor;
        default: number;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    dialog: {
        type: PropType<DialogClass>;
        required: true;
    };
    view: {
        type: PropType<VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | DefineComponent<{}, {}, {}, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>>;
        required: true;
    };
    frame: {
        type: PropType<FrameClass<any>>;
        required: true;
    };
    zIndex: {
        type: NumberConstructor;
        default: number;
    };
}>>, {
    zIndex: number;
}>;
export default _default;
