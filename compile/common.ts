import { UserConfig } from 'vite';
import { pathResolve } from './utils';

export default function getCommonCompileConfig(env: Record<string, string>): UserConfig {
  console.log(env);

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
