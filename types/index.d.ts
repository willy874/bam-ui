declare global {}

type FrameworkType = 'vanilla' | 'vue';
type CssFrameworkType = 'module' | 'tailwind';

declare interface Env {
  [key: string]: string;
  VITE_PORT?: string;
  VITE_DOCKER_PORT?: string;
  VITE_GLOB_APP_TITLE?: string;
  VITE_FRAMEWORK_TYPE?: FrameworkType;
  VITE_CSS_FRAMEWORK?: CssFrameworkType;
  OUT_DIR?: string;
}

declare interface ImportMetaEnv extends Env {}

declare module '*.module.scss' {
  const classes: {
    readonly classNames: {
      [key: string]: string;
    };
    readonly [key: string]: string;
    cssString: string
  };
  export default classes;
}
