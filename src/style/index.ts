import cssModule from './module';
import tailwind from './tailwind';
import type DialogCssModule from './types';

function css(type?: string) {
  if (type === 'tailwind') {
    return tailwind;
  }
  return cssModule;
}

export default css(import.meta.env.VITE_CSS_FRAMEWORK) as Readonly<DialogCssModule>;
