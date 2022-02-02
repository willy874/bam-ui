import { PropType } from 'vue';
import { DialogOptions } from '../../../core/packages';
import VueDialog from './dialog-class';
declare const _default: import("vue").DefineComponent<{
    dialog: {
        type: PropType<DialogOptions | VueDialog>;
        default: () => {};
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    dialog: {
        type: PropType<DialogOptions | VueDialog>;
        default: () => {};
    };
}>>, {
    dialog: DialogOptions | VueDialog;
}>;
export default _default;
