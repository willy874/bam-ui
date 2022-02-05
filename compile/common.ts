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
          find: /@core/,
          replacement: pathResolve('packages', 'core'),
        },
        {
          find: /@style/,
          replacement: pathResolve('packages', 'core', 'style'),
        },
      ]
    },
    css: {
      modules: {
        generateScopedName: 'bam-[local]',
        hashPrefix: 'prefix'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./packages/core/style/import.scss";`,
        },
      },
    },
    plugins: [],
  };
}
