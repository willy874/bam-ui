import { ComponentPublicInstance, DefineComponent } from 'vue';
import type Dialog from '../core/dialog';
import type Frame from '../core/frame';
import { DialogType } from '/#/dialog';

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
export interface FrameComponentProps<V = AnyDefineComponent> {
  dialog: Dialog;
  view: V;
  frame: Frame;
  zIndex: number;
}

export type FrameComponentInstance = ComponentPublicInstance & FrameComponentProps;

export type ViewComponentOption<C extends AnyDefineComponent = AnyDefineComponent> = C extends AnyDefineComponent
  ? C
  : DialogType.BaseView;
