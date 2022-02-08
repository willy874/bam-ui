import { FunctionComponentElement } from 'react';

function recursionParent(paths: FunctionComponentElement<{}>[], vm: FunctionComponentElement<{}>) {
  paths.push(vm);
  if (vm.parent) {
    return recursionParent(paths, vm.parent);
  } else {
    return paths;
  }
}

function getComponentPaths(vm?: FunctionComponentElement<{}>): FunctionComponentElement<{}>[] {
  const paths = [];
  if (vm) {
    return recursionParent(paths, vm);
  }
  return [];
}

export function findParentComponent() {}
