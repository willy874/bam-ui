declare global {}

type FrameworkType = 'vanilla' | 'vue';

declare interface Env {
  [key: string]: string;
  VITE_PORT?: string;
  VITE_DOCKER_PORT?: string;
  VITE_GLOB_APP_TITLE?: string;
  VITE_FRAMEWORK_TYPE?: FrameworkType;
}

declare type ValueOf<T> = T[keyof T];
