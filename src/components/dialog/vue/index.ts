import { reactive } from 'vue';
import type { DialogOptions } from '../types';
import { create, use } from '../core/control';
import Dialog from '../core/dialog';
import Frame from '../core/frame';
import VueDialog from '../vue/Dialog';

/**
 * types
 */
export { DialogOptions };

/**
 * class
 */
export { Dialog, Frame };

/**
 * component
 */
export { VueDialog };

/**
 *
 * @param {number} id
 * @returns {Proxy<Dialog>}
 */
export function useDialog(id?: symbol) {
  return reactive(use(id));
}

/**
 *
 * @param {DialogOptions} options
 * @returns {Dialog}
 */
export function createDialog(options: DialogOptions) {
  return create(options);
}
