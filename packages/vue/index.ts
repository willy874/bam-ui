import { App } from 'vue';
import { setStyleConfig } from '@core/style';
import { bindDialogComponent } from './packages/dialog';
export * from './packages/dialog';

export interface InitOption {
  global: {
    [key: string]: boolean;
  };
  cssFramework: CssFrameworkType;
}

export const bamInit = {
  install(app: App, options: Partial<InitOption> = {}) {
    // 設定導入的 class name
    setStyleConfig('framework', options.cssFramework || 'module');
    // 是否進行全域組件註冊
    if (options.global) {
      switch (true) {
        case options.global.dialog:
          bindDialogComponent(app);
          break;
      }
    }
  },
};
