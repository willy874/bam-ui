import { useState, useLayoutEffect } from 'react';
import { Dialog, DialogOptions } from '@core/packages';
import { getClassNames as css } from '@core/style';
import { createDialog } from './utils';
import FrameComponent from './Frame';
import { uuidDate } from '@core/packages/other/utils';

interface DialogProps {
  dialog?: Dialog | DialogOptions;
}

export default function BamDialog(props: DialogProps) {
  const [dialog] = useState(() => {
    if (props.dialog instanceof Dialog) {
      return props.dialog;
    }
    return createDialog({
      ...props.dialog,
      name: uuidDate(String(props.dialog?.name || '')),
    });
  });

  const [init, setInit] = useState(false);
  const [frames, setFrames] = useState(dialog.frames);
  const [backgroundMask, setBackgroundMask] = useState(dialog.backgroundMask);
  const [isBackgroundMask, setIsBackgroundMask] = useState(dialog.isBackgroundMask);

  /**
   * @Event
   */
  const onClick = (e: MouseEvent) => dialog.onBgclick(e);
  const onDragover = (e: DragEvent) => dialog.onDragover(e);
  const onDragend = (e: DragEvent) => dialog.onDragend(e);
  const onTouchmove = (e: TouchEvent) => dialog.onTouchmove(e);
  const onTouchend = (e: TouchEvent) => dialog.onTouchend(e);
  const onResize = (e: Event) => dialog.onResize(e);

  /**
   * @Lifecycle
   */
  const onMount = () => {
    dialog.onMount();
    dialog.on('update', () => {
      setFrames([...dialog.frames]);
      setBackgroundMask(dialog.backgroundMask);
      setIsBackgroundMask(dialog.isBackgroundMask);
    });
    document.body.addEventListener('click', onClick);
    document.body.addEventListener('dragover', onDragover);
    document.body.addEventListener('dragend', onDragend);
    document.body.addEventListener('touchmove', onTouchmove);
    document.body.addEventListener('touchend', onTouchend);
    window.addEventListener('resize', onResize);
  };
  const onUnmount = () => {
    dialog.onUnmount();
    document.body.removeEventListener('click', onClick);
    document.body.removeEventListener('dragover', onDragover);
    document.body.removeEventListener('dragend', onDragend);
    document.body.removeEventListener('touchmove', onTouchmove);
    document.body.removeEventListener('touchend', onTouchend);
    window.removeEventListener('resize', onResize);
  };

  useLayoutEffect(() => {
    if (dialog.element) {
      if (!init) {
        onMount();
        setInit(true);
      }
    } else {
      onUnmount();
    }
  });

  return (
    <div
      className={css().dialog}
      ref={(el) => dialog.setRootElement(el)}
      style={{
        pointerEvents: isBackgroundMask && frames.length ? 'auto' : 'none',
        opacity: frames.length ? 1 : 0,
      }}
    >
      <div className={css().dialog_container} style={{ background: backgroundMask }}>
        {frames.map((frame, index) => (
          <FrameComponent key={frame.id.description} dialog={dialog} frame={frame} zIndex={index} />
        ))}
      </div>
    </div>
  );
}
