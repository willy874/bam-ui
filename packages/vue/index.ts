import style from '@style/style.module.scss';
import { App } from 'vue';
import { bindDialogComponent } from './packages/dialog';
export * from './packages/dialog';

export interface InitOption {
  global?: {
    [key: string]: boolean;
  }
}
export const bamInit = {
  install (app: App, options: InitOption = {}) {
    if (options.global) {
      switch (true) {
        case options.global.dialog: bindDialogComponent(app)
          break;
      }
    }
    const styleElement = document.createElement('style')
    document.head.appendChild(styleElement)
    styleElement.innerHTML = style.cssString
    styleElement.setAttribute('type', 'text/css')
    styleElement.setAttribute('bam-ui-module', '')
  }
}


