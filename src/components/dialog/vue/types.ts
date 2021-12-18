import type { ComponentPublicInstance } from 'vue';
import type Dialog from '../core/dialog';
import type Frame from '../core/frame';
import type { TransformStyle } from '../utils';

export interface FrameComponentType extends ComponentPublicInstance {
  dialog: Dialog;
  frame: Frame;
  zIndex: number;
  transform: TransformStyle;
}
