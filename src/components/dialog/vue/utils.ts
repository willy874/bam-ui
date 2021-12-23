import { getCurrentInstance, DefineComponent, ComponentInternalInstance, ComponentPublicInstance } from 'vue';

function recursionParent(paths: ComponentInternalInstance[], vm: ComponentInternalInstance) {
  paths.push(vm);
  if (vm.parent) {
    return recursionParent(paths, vm.parent);
  } else {
    return paths;
  }
}

export function getComponentPaths(vm?: ComponentInternalInstance): ComponentInternalInstance[] {
  const paths = [];
  if (vm) {
    return recursionParent(paths, vm);
  }
  return [];
}

export function findParentComponent<T = ComponentPublicInstance>(component: DefineComponent) {
  const instance = getCurrentInstance();
  if (instance) {
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
