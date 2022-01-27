import {
  getCurrentInstance,
  ComponentInternalInstance,
  ComponentPublicInstance,
  defineComponent,
  isProxy,
  markRaw,
} from 'vue';

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
