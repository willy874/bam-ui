import { config } from './style.config';
import tailwind from './tailwind';
import modules from './style.module.scss';

export function getClassNames() {
  if (config.framework === 'tailwind') {
    return tailwind;
  }
  return modules;
}

export function setStyleConfig(key: string, value: unknown) {
  config[key] = value;
}

export function getStyleConfig() {
  return { ...config };
}
