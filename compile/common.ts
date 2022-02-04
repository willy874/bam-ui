import { UserConfig } from 'vite';
import { pathResolve } from './utils';

export default function getCommonCompileConfig(env: Env): UserConfig {
  const { VITE_FRAMEWORK_TYPE } = env;
  const framework = VITE_FRAMEWORK_TYPE?.toLocaleLowerCase() || 'vanilla';
  console.log(framework);
  const cssModule: { [key: string]: string } = {};
  const cssString: { [key: string]: string } = {};
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
        generateScopedName: (local: string, fileName: string, css: string) => {
          const str = css.split('\n\n').find((str) => new RegExp('\\s*(#|.)?' + local + '\\s*{(\\s|\\S)+\\}').test(str));
          cssString[fileName] = css
          if (str) {
            cssModule[local] = str;
          }
          return 'bam-' + local;
        },
        // generateScopedName: 'bam-[local]',
        hashPrefix: 'prefix',
        getJSON: (...args: any) => {
          const json = args[1];
          json.cssString = ''
          Object.keys(cssString).forEach(key => {
            json.cssString += cssString[key] 
          })
          json.classNames = {};
          for (const key in cssModule) {
            json.classNames[key] = cssModule[key];
          }
        },
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
