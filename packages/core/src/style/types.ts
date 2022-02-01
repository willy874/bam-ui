declare interface CssModuleBase {
  readonly [key: string]: string;
}
export interface DialogCssModule extends CssModuleBase {
  dialog: string;
  dialog_container: string;
  dialog_frame: string;
  dialog_view: string;
  dialog_resize_mode: string;
  dialog_resize_top: string;
  dialog_resize_bottom: string;
  dialog_resize_right: string;
  dialog_resize_left: string;
}
