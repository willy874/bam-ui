import { onMounted, onUpdated, onUnmounted, defineComponent, getCurrentInstance, PropType } from 'vue';
import { getTransformStyleString } from 'bam-utility-plugins';
import { Dialog, Frame } from '@core/packages';
import { getClassNames as css } from '@core/style';
import { createVNode } from './utils';

export default defineComponent({
  name: 'bam-frame',
  props: {
    dialog: {
      type: Object as PropType<Dialog>,
      required: true,
    },
    frame: {
      type: Object as PropType<Frame>,
      required: true,
    },
    zIndex: {
      type: Number,
      default: 0,
    },
  },

  setup(props, { expose }) {
    const instance = getCurrentInstance();
    const View = createVNode(props.frame);

    /**
     * @Data
     */
    expose({});

    /**
     * @Created
     */
    if (props.dialog.isBackgroundMask && props.frame.hook.bgclick.length === 0) {
      props.frame.on('bgclick', () => props.frame.onClose());
    }

    /**
     * @Event
     */

    /**
     * @Lifecycle
     */
    onMounted(() => props.frame.onMount(instance));
    onUpdated(() => props.frame.onUpdate(instance));
    onUnmounted(() => props.frame.onUnmount(instance));

    /**
     * @Render
     */
    return () => (
      <div
        ref={(e: Element) => props.frame.setFrameElement(e)}
        class={css().dialog_frame}
        style={{
          zIndex: props.zIndex,
          transform: getTransformStyleString({
            translateX: props.frame.isFull ? '0' : props.frame.left,
            translateY: props.frame.isFull ? '0' : props.frame.top,
          }),
          width: props.frame.isFull ? '100vw' : props.frame.width,
          height: props.frame.isFull ? '100vh' : props.frame.height,
        }}
        onClick={(e) => e.stopPropagation()}
        onMousedown={() => props.dialog.sortToRight(props.frame.id)}
      >
        {View}
      </div>
    );
  },
});
