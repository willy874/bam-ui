import { App } from 'vue'
import BamDialog from './Dialog';
import BamFrame from './Frame';
import BamFrameDraggable from './Draggable';
import BamFrameResize from './Resize';
import Dialog from './dialog-class';
import Frame from './frame-class';
export { BamDialog, BamFrame, BamFrameDraggable, BamFrameResize, Dialog, Frame };
export * from '@core/packages/dialog/types';
export * from '@core/packages/dialog/interface';
export * from './types';
export * from './utils';
export const bindDialogComponent = (app: App) => {
  app.component(BamDialog.name, BamDialog)
  app.component(BamFrame.name, BamFrame)
  app.component(BamFrameDraggable.name, BamFrameDraggable)
  app.component(BamFrameDraggable.name, BamFrameDraggable)
}