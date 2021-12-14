import type Dialog from './dialog';
import type Frame from './frame';

export interface DialogDragEventInit {
  event: DragEvent;
  dialog: Dialog;
  frame: Frame;
}

export class DialogDragEvent extends DragEvent {
  public dialog: Dialog;
  public frame: Frame;

  constructor(init: DialogDragEventInit) {
    const dragType = init.event.type;
    const dragEventInit = { dataTransfer: init.event.dataTransfer };
    super(dragType, dragEventInit);

    this.dialog = init.dialog;
    this.frame = init.frame;
  }
}

export interface DialogTouchEventInit {
  event: TouchEvent;
  dialog: Dialog;
  frame: Frame;
}

export class DialogTouchEvent extends TouchEvent {
  public dialog: Dialog;
  public frame: Frame;

  constructor(init: DialogTouchEventInit) {
    const touchType = init.event.type;
    const touchEventInit = {
      changedTouches: Array.from(init.event.changedTouches),
      targetTouches: Array.from(init.event.targetTouches),
      touches: Array.from(init.event.touches),
    };
    super(touchType, touchEventInit);

    this.dialog = init.dialog;
    this.frame = init.frame;
  }
}

export interface DialogBackgroundClickEventInit {
  event: PointerEvent;
  dialog: Dialog;
  frame: Frame;
}

export class DialogBackgroundClickEvent {
  public event: PointerEvent;
  public dialog: Dialog;
  public frame: Frame;

  constructor(init: DialogBackgroundClickEventInit) {
    this.event = init.event;
    this.dialog = init.dialog;
    this.frame = init.frame;
  }
}
