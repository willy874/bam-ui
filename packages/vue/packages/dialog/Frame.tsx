import {
  onMounted,
  onUpdated,
  onUnmounted,
  defineComponent,
  getCurrentInstance,
  PropType,
  Teleport,
  reactive,
} from 'vue';
import { getTransformStyleString } from 'bam-utility-plugins';
import { Dialog, Frame, OpenFrameOptions } from '@core/packages';
import { getClassNames as css } from '@core/style';
import { createVNode, useDialog, isDialog, isFrame, useFrame } from './utils';

export default defineComponent({
  name: 'bam-frame',
  props: {
    dialog: {
      type: Object as PropType<Dialog>,
      default: null,
    },
    frame: {
      type: Object as PropType<Frame | OpenFrameOptions>,
      default: () => ({}),
    },
    zIndex: {
      type: Number,
      default: 1,
    },
  },

  setup(props, { expose, slots }) {
    const instance = getCurrentInstance();
    const dialog = isDialog(props.dialog) ? props.dialog : useDialog();
    const frame = (() => {
      if (isFrame(props.frame)) {
        return props.frame;
      } else {
        const id = Symbol(props.frame?.name || 'Frame');
        dialog.openFrame(() => slots.default, {
          ...props.frame,
          id,
        });
        return reactive(useFrame(id));
      }
    })();
    const View = createVNode(frame);
    const rootId = instance?.appContext.app._container.id;

    /**
     * @Data
     */
    expose({
      frame,
    });

    /**
     * @Created
     */
    // 必須是 isBackgroundMask 的模式下並且未綁定任何事件。
    if (dialog.isBackgroundMask && frame.hook.bgclick.length === 0) {
      frame.on('bgclick', () => frame.onClose());
    }

    /**
     * @Lifecycle
     */
    onMounted(() => frame.onMount(instance));
    onUpdated(() => frame.onUpdate(instance));
    onUnmounted(() => frame.onUnmount(instance));

    const renderFrame = () => (
      <div
        ref={(e: Element) => frame.setFrameElement(e)}
        class={css().dialog_frame}
        style={{
          zIndex: props.zIndex + 1,
          transform: getTransformStyleString({
            translateX: frame.isFull ? '0' : frame.left,
            translateY: frame.isFull ? '0' : frame.top,
          }),
          width: frame.isFull ? '100vw' : frame.width,
          height: frame.isFull ? '100vh' : frame.height,
        }}
        onClick={(e) => e.stopPropagation()}
        onMousedown={() => dialog.sortToRight(frame.id)}
      >
        {View}
      </div>
    );
    /**
     * @Render
     */
    if (slots.default) {
      return () => <Teleport to={'#' + rootId}>{renderFrame()}</Teleport>;
    } else {
      return () => renderFrame();
    }
  },
});
