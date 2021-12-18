import { ref, onMounted, onUpdated, onUnmounted, defineComponent } from 'vue';
import type { PropType } from 'vue';
import Dialog from '../core/dialog';
import Frame from '../core/frame';
import { getTransformStyleString, TransformStyle } from '../utils';

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
    transform: {
      type: Object as PropType<TransformStyle>,
      default: () => ({}),
    },
    zIndex: {
      type: Number,
      default: 1,
    },
  },

  setup(props, context) {
    const vm = ref(null);

    /**
     * @Created
     */
    if (props.dialog.isBackgroundMask && props.frame.hook.bgClick.length === 0) {
      props.frame.on('bgClick', () => props.frame.onClose(props.dialog));
    }

    /**
     * @Event
     */
    const onClick = (e: PointerEvent) => {
      e.stopPropagation();
      props.dialog.sortToRight(props.frame);
    };

    /**
     * @Lifecycle
     */
    onMounted(() => props.frame.onMount(vm.value));
    onUpdated(() => props.frame.onUpdate(vm.value));
    onUnmounted(() => props.frame.onUnmount(vm.value));

    /**
     * @Render
     */
    const render = () => (
      <div
        ref={(e: Element) => props.frame.setFrameElement(e)}
        class={{ 'absolute top-0 left-0 pointer-events-auto': true }}
        style={{
          zIndex: props.zIndex,
          transform: getTransformStyleString({
            ...props.transform,
            translateX: props.frame.left,
            translateY: props.frame.top,
          }),
        }}
        onClick={onClick}
      >
        {context.slots.default && context.slots.default()}
      </div>
    );

    return (v) => {
      vm.value = v;

      return render();
    };
  },
});
