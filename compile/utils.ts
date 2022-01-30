import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

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
  if (type === 'vue') {
    return [
      //
      vue(),
      //
      vueJsx(),
      //
      vueSetupExtend(),
    ];
  }

  return [];
}
