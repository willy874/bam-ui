import { ComponentPublicInstance } from 'vue';
/**
 * 放入 vue 實體，可以用 getCurrentInstance() 取得，要在 setup 獲取。
 * @param {ComponentPublicInstance} component
 * @returns {ComponentPublicInstance}
 */
export declare function findParentComponent<T = ComponentPublicInstance>(component: any): T | undefined;
export declare function defineComponentProps(component: any): import("vue").DefineComponent<unknown, object, {}, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<unknown>, {}>;
