import cssModule from './module';
import tailwind from './tailwind';
import type DialogCssModule from './types';

function appendStyle(css: { [key: string]: string }) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-name', 'module');
  document.head.appendChild(style);
  for (const key in css) {
    style.innerHTML += '\n' + css[key];
  }
}

function css(type?: string) {
  if (type === 'tailwind') {
    return tailwind;
  }
  if (!import.meta.env.DEV) {
    appendStyle(cssModule.css);
  }
  return cssModule;
}

export default css(import.meta.env.VITE_CSS_FRAMEWORK) as Readonly<DialogCssModule>;
