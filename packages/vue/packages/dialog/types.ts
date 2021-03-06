import type { ComponentOptionsBase, ComponentPublicInstance, DefineComponent, VNode } from 'vue';
import type { Dialog, Frame } from '@core/packages';

export type AnyDefineComponent = DefineComponent<
  unknown,
  unknown,
  unknown,
  any,
  any,
  any,
  any,
  any,
  any,
  unknown,
  unknown,
  unknown
> & {};

export type AnyComponentPublicInstance = ComponentPublicInstance<
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  false,
  ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>
>;
export interface FrameComponentProps<V = AnyDefineComponent> {
  dialog: Dialog;
  view: V;
  frame: Frame;
  zIndex: number;
}

export type FrameComponentInstance = ComponentPublicInstance & FrameComponentProps;

export type ViewComponentOption = AnyDefineComponent | VNode;
