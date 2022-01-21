import { UserConfig } from 'vite';
import { pathResolve, getFrameworkDependPlugins } from './utils';
import dts from 'vite-plugin-dts';
import getCommonCompileConfig from './common';

export default function (env: Record<string, string>): UserConfig {
  const common = getCommonCompileConfig(env);
  const { VITE_FRAMEWORK_TYPE } = env;

  const frameworkPlugins = getFrameworkDependPlugins(VITE_FRAMEWORK_TYPE);
  const plugins = [
    ...frameworkPlugins,
    //
    dts(),
  ];
  if (common.plugins) {
    common.plugins.concat(...plugins);
  } else {
    common.plugins = plugins;
  }

  common.build = {
    lib: {
      entry: pathResolve('src', 'packages', 'index.ts'),
      name: 'bam-ui',
      fileName: (format) => `bam.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
    },
  };

  return common;
}
