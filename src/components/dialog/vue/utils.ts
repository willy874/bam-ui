import type { ComponentPublicInstance } from 'vue';
import type { FrameComponentType } from './types';
import FrameComponent from './Frame';

type ComponentPaths = ComponentPublicInstance[];

function recursionParent(paths: ComponentPaths, vm: ComponentPublicInstance) {
  paths.push(vm);
  if (vm.$parent) {
    return recursionParent(paths, vm.$parent);
  } else {
    return paths;
  }
}

export function getComponentPaths(vm?: ComponentPublicInstance): ComponentPaths {
  const paths = [];
  if (vm) {
    return recursionParent(paths, vm);
  }
  return [];
}

export function findFrame(vm?: ComponentPublicInstance) {
  if (vm) {
    const paths = getComponentPaths(vm);
    return (paths.find((vm) => vm.$options === FrameComponent) as FrameComponentType) || undefined;
  }
}
