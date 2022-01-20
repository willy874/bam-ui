import type { ComponentPublicInstance, DefineComponent } from 'vue';
import type Dialog from '../core/dialog';
import type Frame from '../core/frame';

export interface FrameComponentProps<V = DefineComponent> {
  dialog: Dialog;
  view: V;
  frame: Frame;
  zIndex: number;
}
export interface FrameComponentDate {}

export type FrameComponentInstance = ComponentPublicInstance & FrameComponentProps & FrameComponentDate;
