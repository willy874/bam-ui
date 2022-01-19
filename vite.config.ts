import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import purgeIcons from 'vite-plugin-purge-icons';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
const root = process.cwd();

function pathResolve(dir: string) {
  return resolve(root, '.', dir);
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  console.log(command);

  const { VITE_PORT } = loadEnv(mode, root);

  return {
    server: {
      host: true,
      port: Number(VITE_PORT),
      // proxy: createProxy(VITE_PROXY),
    },

    resolve: {
      alias: [
        // /@/xxxx => /src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => /types/xxxx
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
};
