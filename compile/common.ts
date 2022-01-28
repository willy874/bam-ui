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
      modules: {
        generateScopedName: 'bam-[local]',
        hashPrefix: 'prefix',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/style/import.scss";`,
        },
      },
    },
    plugins: [],
  };
}
