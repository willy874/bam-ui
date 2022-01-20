import { reactive } from 'vue';
import type { DialogOptions, FrameData, FrameMethods } from '../types';
import {
  createDialog as createDialogNative,
  useDialog as useDialogNative,
  useFrame as useFrameNative,
} from '../core/control';
import Dialog from '../core/dialog';
import Frame from '../core/frame';
import VueDialog from './Dialog';
import FrameDraggable from './Draggable';
import FrameResize from './Resize';

/**
 * types
 */
export { DialogOptions, FrameData, FrameMethods };

/**
 * class
 */
export { Dialog, Frame };

/**
 * component
 */
export { VueDialog, FrameDraggable, FrameResize };

/**
 *
 * @param {DialogOptions} options
 * @returns {Dialog}
 */
export function createDialog(options: DialogOptions) {
  return createDialogNative(options);
}

/**
 *
 * @param {symbol} id
 * @returns {Proxy<Dialog>}
 */
export function useDialog(id?: symbol) {
  return reactive(useDialogNative(id));
}

/**
 *
 * @param {symbol} id
 * @returns {Proxy<Frame>}
 */
export function useFrame(id: symbol) {
  const frame = useFrameNative(id);
  if (frame) {
    return reactive(frame);
  }
}
