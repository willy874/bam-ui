import { onMounted, onUpdated, onUnmounted, computed, defineComponent, getCurrentInstance } from 'vue';
import type { DefineComponent, PropType } from 'vue';
import Dialog from '../core/dialog';
import Frame from '../core/frame';
import { getFrameData, getFrameMethods } from '../core/interface';
import { getTransformStyleString } from 'bam-utility-plugins';
import css from '/@/style';

export default defineComponent({
  name: 'bam-frame',
  props: {
    dialog: {
      type: Object as PropType<Dialog>,
      required: true,
    },
    view: {
      type: Object as PropType<DefineComponent>,
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
     * @Computed
     */
    const frameData = computed(() => getFrameData(props.frame));
    const frameMethods = computed(() => getFrameMethods(props.frame));

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
    const View = props.view;
    return () => (
      <div
        ref={(e: Element) => props.frame.setFrameElement(e)}
        class={css.dialog_frame}
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
        <View
          class={css.dialog_view}
          frame-data={frameData.value}
          frame-methods={frameMethods.value}
          frame-props={props.frame.props}
        />
      </div>
    );
  },
});
