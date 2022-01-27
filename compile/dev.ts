import { UserConfig } from 'vite';
import { getFrameworkDependPlugins, pathResolve } from './utils';
import legacy from '@vitejs/plugin-legacy';
import purgeIcons from 'vite-plugin-purge-icons';
import getCommonCompileConfig from './common';
import os from 'os';

export default function (env: Env): UserConfig {
  const common = getCommonCompileConfig(env);
  const { VITE_PORT, VITE_DOCKER_PORT, VITE_FRAMEWORK_TYPE } = env;

  const port = Number(VITE_PORT) || 8000;
  const dockerPort = os.type() == 'Linux' ? Number(VITE_DOCKER_PORT) : port;
  common.server = {
    host: true,
    port,
    hmr: {
      port: dockerPort,
    },
  };
  const frameworkType = VITE_FRAMEWORK_TYPE?.toLocaleLowerCase() || 'vanilla';
  const frameworkPlugins = getFrameworkDependPlugins(frameworkType);
  const plugins = [
    ...frameworkPlugins,
    //
    legacy(),
    //
    purgeIcons(),
  ];
  if (common.plugins) {
    common.plugins.push(...plugins);
  } else {
    common.plugins = plugins;
  }
  common.build = {
    target: 'es2015',
  };

  return common;
}
