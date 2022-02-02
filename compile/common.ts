import { UserConfig } from 'vite';

export default function getCommonCompileConfig(env: Env): UserConfig {
  const { VITE_FRAMEWORK_TYPE } = env;
  const framework = VITE_FRAMEWORK_TYPE?.toLocaleLowerCase() || 'vanilla';
  console.log(framework);
  const cssModule: { [key: string]: string } = {};
  return {
    resolve: {},
    css: {
      modules: {
        generateScopedName: (...args: any) => {
          const name = args[0];
          const css = args[2];
          const str = css.split('\n\n').find((str) => new RegExp('\\s*(#|.)?' + name + '\\s*{(\\s|\\S)+\\}').test(str));
          if (str) {
            cssModule[name] = str;
          }
          return 'bam-' + name;
        },
        // generateScopedName: 'bam-[local]',
        hashPrefix: 'prefix',
        getJSON: (...args: any) => {
          const json = args[1];
          json.css = {};
          for (const key in cssModule) {
            json.css[key] = cssModule[key];
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
