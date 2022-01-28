import { UserConfig } from 'vite';
import { pathResolve, getFrameworkDependPlugins } from './utils';
import getCommonCompileConfig from './common';
import dts from 'vite-plugin-dts';

export default function (env: Env): UserConfig {
  const common = getCommonCompileConfig(env);
  const { VITE_FRAMEWORK_TYPE } = env;
  const frameworkType = VITE_FRAMEWORK_TYPE?.toLocaleLowerCase() || 'vanilla';
  const frameworkPlugins = getFrameworkDependPlugins(frameworkType);
  const plugins = [
    ...frameworkPlugins,
    //
    dts(),
  ];

  if (common.plugins) {
    common.plugins.push(...plugins);
  } else {
    common.plugins = plugins;
  }

  common.build = {
    lib: {
      entry: pathResolve('src', 'vue', 'export.ts'),
      name: 'bam-ui',
      fileName: (format) => `bam.${format}.js`,
    },
    rollupOptions: {
      external: ['bam-utility-plugins'],
    },
  };
  if (frameworkType !== 'vanilla' && Array.isArray(common.build.rollupOptions?.external)) {
    common.build.rollupOptions?.external.push(frameworkType);
  }

  return common;
}
