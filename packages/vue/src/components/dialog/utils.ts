import type { DialogOptions, FrameOptions } from 'bam-ui/packages/core/src/index';
import {
  reactive,
  getCurrentInstance,
  UnwrapNestedRefs,
  ComponentInternalInstance,
  ComponentPublicInstance,
  defineComponent,
  isProxy,
  markRaw,
} from 'vue';
import VueDialog from './dialog-class';
import VueFrame from './frame-class';

const DialogCollection: { [key: symbol]: () => UnwrapNestedRefs<VueDialog> } = {};
const FrameCollection: { [key: symbol]: () => VueFrame } = {};

const defaultDialogRef: {
  get: (() => UnwrapNestedRefs<VueDialog>) | null;
} = {
  get: null,
};

export function createDialog(options: DialogOptions = {}) {
  const dialog = new VueDialog({
    id: typeof options.name === 'symbol' ? options.name : Symbol(options.name),
    hook: options.hook || {},
    isBackgroundMask: options.isBackgroundMask === false ? false : true,
    backgroundMask: options.backgroundMask || 'transparent',
  });
  const getDialog = () => reactive(dialog);
  DialogCollection[dialog.id] = getDialog;
  if (!defaultDialogRef.get) {
    defaultDialogRef.get = getDialog;
  }
  return dialog;
}

export function setDefaultDialog(dialog: VueDialog) {
  const getDialog = () => reactive(dialog);
  DialogCollection[dialog.id] = getDialog;
  defaultDialogRef.get = getDialog;
  return getDialog();
}

export function useDialog(id?: symbol): UnwrapNestedRefs<VueDialog> {
  if (!defaultDialogRef.get) {
    throw new Error('not created dialog');
  }
  const getDialog = (id && DialogCollection[id]) || defaultDialogRef.get;
  return getDialog();
}

export function useFrame<V>(id: symbol): VueFrame<V> {
  const getFrame = FrameCollection[id];
  return getFrame() as VueFrame<V>;
}

export function createFrame<V>(options: FrameOptions<V>): VueFrame<V> {
  const frame = new VueFrame<V>({
    ...options,
    dialogId: options.name ? Symbol(options.name) : Symbol('Frame'),
  });
  FrameCollection[frame.id] = () => frame;
  return frame;
}

export function isFrame<V>(f: unknown): f is VueFrame<V> {
  return typeof f === 'object' && f instanceof VueFrame;
}

function recursionParent(paths: ComponentInternalInstance[], vm: ComponentInternalInstance) {
  paths.push(vm);
  if (vm.parent) {
    return recursionParent(paths, vm.parent);
  } else {
    return paths;
  }
}

function getComponentPaths(vm?: ComponentInternalInstance): ComponentInternalInstance[] {
  const paths = [];
  if (vm) {
    return recursionParent(paths, vm);
  }
  return [];
}

/**
 * 放入 vue 實體，可以用 getCurrentInstance() 取得，要在 setup 獲取。
 * @param {ComponentPublicInstance} component
 * @returns {ComponentPublicInstance}
 */
export function findParentComponent<T = ComponentPublicInstance>(component: any) {
  const instance = getCurrentInstance();
  if (instance && component) {
    const paths = getComponentPaths(instance);
    for (const vm of paths) {
      if (!vm.type.name && !component.name) {
        return;
      }
      if (vm.type.name === component.name) {
        return vm.proxy as unknown as T;
      }
    }
  }
}

export function defineComponentProps(component: any) {
  if (isProxy(component)) {
    console.warn('請放入未被代理的組件');
  }
  return markRaw(defineComponent(component));
}
