import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';

export function pathResolve(dir: string | string[], ...dirs: string[]) {
  if (typeof dir === 'string') {
    if (dirs && dirs.length) {
      return resolve(process.cwd(), dir, ...dirs);
    }
    return resolve(process.cwd(), dir);
  }
  return resolve(process.cwd(), ...dir);
}

export function getFrameworkDependPlugins(type) {
  if (type === 'all') {
    return [react(), vue()];
  }
  if (type === 'vue') {
    return [vue()];
  }
  if (type === 'react') {
    return [];
  }

  return [];
}
