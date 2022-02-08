import { getTransformStyleString } from 'bam-utility-plugins';
import { Dialog, Frame, OpenFrameOptions } from '@core/packages';
import { getClassNames as css } from '@core/style';
import { createVNode, isFrame, useFrame } from './utils';
import { useLayoutEffect, useState } from 'react';

interface FrameProps {
  dialog: Dialog;
  frame: Frame | OpenFrameOptions;
  zIndex?: number;
  children?: any;
}

export default (props: FrameProps) => {
  // { dialog, frame, zIndex }

  const [frame] = useState(() => {
    if (isFrame(props.frame)) {
      return props.frame;
    } else {
      const id = Symbol(props.frame?.name || 'Frame');
      props.dialog.openFrame(() => props.children, {
        ...props.frame,
        id,
      });
      return useFrame(id);
    }
  });

  const [init, setInit] = useState(false);
  const [dialog] = useState(props.dialog);
  const [width, setWidth] = useState(frame.width);
  const [height, setHeight] = useState(frame.height);
  const [top, setTop] = useState(frame.top);
  const [left, setLeft] = useState(frame.left);
  const View = createVNode(frame);

  /**
   * @Lifecycle
   */
  const onMount = () => {
    frame.onMount();
    if (dialog.isBackgroundMask && frame.hook.bgclick.length === 0) {
      frame.on('bgclick', () => frame.onClose());
    }
    frame.on('update', () => {
      setWidth(frame.width);
      setHeight(frame.height);
      setTop(frame.top);
      setLeft(frame.left);
    });
  };
  const onUnmount = () => {
    frame.onUnmount();
  };

  useLayoutEffect(() => {
    if (frame.element) {
      if (!init) {
        onMount();
        setInit(true);
      }
    } else {
      onUnmount();
    }
  });
  const zIndex = props.zIndex || 0;

  return (
    <div
      ref={(e) => frame.setFrameElement(e)}
      className={css().dialog_frame}
      style={{
        zIndex: zIndex + 1,
        transform: getTransformStyleString({
          translateX: frame.isFull ? '0' : left,
          translateY: frame.isFull ? '0' : top,
        }),
        width: frame.isFull ? '100vw' : width,
        height: frame.isFull ? '100vh' : height,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={() => dialog.sortToRight(frame.id)}
    >
      {View}
    </div>
  );
};
