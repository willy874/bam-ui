import { UserConfig } from 'vite';
import { getFrameworkDependPlugins } from './utils';
import legacy from '@vitejs/plugin-legacy';
import purgeIcons from 'vite-plugin-purge-icons';
import getCommonCompileConfig from './common';

export default function (env: Record<string, string>): UserConfig {
  const common = getCommonCompileConfig(env);
  const { VITE_PORT, VITE_FRAMEWORK_TYPE } = env;

  const port = Number(VITE_PORT) || 8000;
  common.server = {
    host: true,
    port,
  };

  const frameworkPlugins = getFrameworkDependPlugins(VITE_FRAMEWORK_TYPE);
  const plugins = [
    ...frameworkPlugins,
    //
    legacy(),
    //
    purgeIcons(),
  ];
  if (common.plugins) {
    common.plugins.concat(...plugins);
  } else {
    common.plugins = plugins;
  }

  common.build = {
    target: 'es2015',
  };

  return common;
}
