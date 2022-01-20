import { UserConfig } from 'vite';
import { pathResolve } from './utils';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import dts from 'vite-plugin-dts';

export default function (env: Record<string, string>): UserConfig {
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

    build: {
      lib: {
        entry: pathResolve('src', 'packages', 'index.ts'),
        name: 'bam-ui',
        fileName: (format) => `bam.${format}.js`,
      },
      rollupOptions: {
        external: ['vue'],
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/style/variables.scss";`,
        },
      },
    },

    plugins: [
      //
      vue(),
      //
      vueJsx(),
      //
      vueSetupExtend(),
      //
      dts(),
    ],
  };
}
