import type {
  ComponentPublicInstance,
  DefineComponent,
  RenderFunction,
  ComputedOptions,
  MethodOptions,
  ComponentOptionsMixin,
  ComponentPropsOptions,
  ObjectEmitsOptions,
} from 'vue';
import type Dialog from '../core/dialog';
import type Frame from '../core/frame';

export interface FrameComponentProps<V = DefineComponent> {
  dialog: Dialog;
  view: V;
  frame: Frame;
  zIndex: number;
}
export interface FrameComponentData extends Record<string, unknown> {}
export interface FrameComponentComputed extends ComputedOptions {}
export interface FrameComponentMethods extends MethodOptions {}
export interface FrameComponentMixin extends ComponentOptionsMixin {}
export interface FrameComponentExtends extends ComponentOptionsMixin {}
export interface FrameComponentEmits extends ObjectEmitsOptions {}

export type FrameComponentOptions<V = DefineComponent> = DefineComponent<
  ComponentPropsOptions<FrameComponentProps<V>>,
  RenderFunction,
  FrameComponentData,
  FrameComponentComputed,
  FrameComponentMethods,
  FrameComponentMixin,
  FrameComponentExtends,
  FrameComponentEmits
>;

export type FrameComponentInstance<V = DefineComponent> = ComponentPublicInstance<
  FrameComponentProps<V>,
  any,
  FrameComponentData,
  FrameComponentComputed,
  FrameComponentMethods,
  FrameComponentEmits,
  any,
  any,
  false,
  FrameComponentOptions
>;
