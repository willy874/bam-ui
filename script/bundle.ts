import { build } from 'vite';
import getLibraryCompile from '../compile/lib';

build(
  getLibraryCompile({
    VITE_FRAMEWORK_TYPE: 'vue',
    VITE_CSS_FRAMEWORK: 'module',
    OUT_DIR: 'vue-dist',
  }),
);
