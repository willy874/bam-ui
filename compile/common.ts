import { UserConfig } from 'vite';
import { pathResolve } from './utils';

export default function getCommonCompileConfig(env: Env): UserConfig {
  const { VITE_FRAMEWORK_TYPE } = env;
  const framework = VITE_FRAMEWORK_TYPE?.toLocaleLowerCase() || 'vanilla';
  console.log(framework);

  return {
    resolve: {
      alias: [
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/style/variables.scss";`,
        },
      },
    },
    plugins: [],
  };
}
