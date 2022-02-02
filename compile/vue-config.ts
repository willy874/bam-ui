import build from './lib';

export default () => {
  return build({
    VITE_FRAMEWORK_TYPE: 'vue',
    VITE_CSS_FRAMEWORK: 'module',
    OUT_DIR: 'pkg-vue',
  });
};
