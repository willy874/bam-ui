import { App } from 'vue';
import { Dialog, Frame } from '@core/packages';
import BamDialog from './Dialog';
import BamFrame from './Frame';
import BamFrameDraggable from './Draggable';
import BamFrameResize from './Resize';

export { BamDialog, BamFrame, BamFrameDraggable, BamFrameResize, Dialog, Frame };

export * from '@core/packages/dialog/types';
export * from '@core/packages/dialog/interface';
export * from './types';
export * from './utils';

export const bindDialogComponent = (app: App) => {
  app.component(BamDialog.name, BamDialog);
  app.component(BamFrame.name, BamFrame);
  app.component(BamFrameDraggable.name, BamFrameDraggable);
  app.component(BamFrameDraggable.name, BamFrameDraggable);
};
