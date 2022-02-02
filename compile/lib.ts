import { UserConfig, AliasOptions } from 'vite';
import { pathResolve, getFrameworkDependPlugins } from './utils';
import getCommonCompileConfig from './common';
import dts from 'vite-plugin-dts';

export default function (env: Env): UserConfig {
  const common = getCommonCompileConfig(env);
  const { VITE_FRAMEWORK_TYPE, OUT_DIR } = env;
  const frameworkType = VITE_FRAMEWORK_TYPE?.toLocaleLowerCase() || 'vanilla';
  const frameworkPlugins = getFrameworkDependPlugins(frameworkType);
  const plugins = [
    ...frameworkPlugins,
    //
    dts(),
  ];

  const alias: AliasOptions = [
    {
      find: /@core/,
      replacement: pathResolve('packages', 'core'),
    },
    {
      find: /@style/,
      replacement: pathResolve('packages', 'core', 'style', 'module'),
    },
  ];
  if (common.resolve) {
    common.resolve.alias = alias;
  }

  if (common.plugins) {
    common.plugins.push(...plugins);
  } else {
    common.plugins = plugins;
  }

  common.build = {
    outDir: OUT_DIR || 'dist',
    lib: {
      entry: pathResolve('packages', frameworkType, 'index.ts'),
      name: 'bam-ui',
      fileName: (format) => `bam-ui.${format}.js`,
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
