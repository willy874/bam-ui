import { UserConfig } from 'vite';
import { pathResolve } from './utils';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import purgeIcons from 'vite-plugin-purge-icons';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

export default function (env: Record<string, string>): UserConfig {
  const { VITE_PORT } = env;
  const port = Number(VITE_PORT) || 8000;
  return {
    server: {
      host: true,
      port,
      hmr: {},
      // proxy: createProxy(VITE_PROXY),
    },

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
      target: 'es2015',
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
      legacy(),
      //
      purgeIcons(),
    ],
  };
}
