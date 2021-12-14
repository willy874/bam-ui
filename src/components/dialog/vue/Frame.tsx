import { ref, onMounted, onUpdated, onUnmounted, defineComponent } from 'vue';
import type { PropType } from 'vue';
import Dialog from '../core/dialog';
import Frame from '../core/frame';

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
      default: 1,
    },
  },

  setup(props, context) {
    const vm = ref(null);
    if (props.frame.hook.bgClick.length === 0) {
      props.frame.on('bgClick', () => props.frame.onClose(props.dialog));
    }

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
        class={{ 'absolute top-0 left-0 transform': true }}
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: props.zIndex }}
        draggable={true}
        onDragstart={(e) => props.dialog.onDragstart(e, props.frame.id)}
        onTouchstart={(e) => props.dialog.onTouchstart(e, props.frame.id)}
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
