import {
  onMounted,
  onUpdated,
  onUnmounted,
  computed,
  defineComponent,
  getCurrentInstance,
  isVNode,
  VNode,
  DefineComponent,
  PropType,
} from 'vue';
import { getFrameData, getFrameMethods } from '@core/packages';
import { getTransformStyleString } from 'bam-utility-plugins';
import DialogClass from './dialog-class';
import FrameClass from './frame-class';
import css from '@style/dialog/style.module.scss';

export default defineComponent({
  name: 'BamFrame',
  props: {
    dialog: {
      type: Object as PropType<DialogClass>,
      required: true,
    },
    view: {
      type: Object as PropType<VNode | DefineComponent>,
      required: true,
    },
    frame: {
      type: Object as PropType<FrameClass>,
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
        {isVNode(props.view) ? (
          props.view
        ) : (
          <props.view
            class={css.dialog_view}
            frame-data={frameData.value}
            frame-methods={frameMethods.value}
            frame-props={props.frame.props}
          />
        )}
      </div>
    );
  },
});
