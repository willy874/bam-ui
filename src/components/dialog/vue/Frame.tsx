import { ref, onMounted, onUpdated, onUnmounted, defineComponent, PropType } from 'vue';
import { EventType } from '../types';
import Dialog from '../core/dialog';
import Frame from '../core/frame';
import { getTransformStyleString } from '../utils';

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

    /**
     * @Created
     */
    if (props.dialog.isBackgroundMask && props.frame.hook.bgClick.length === 0) {
      props.frame.on('bgClick', () => props.frame.onClose(props.dialog));
    }

    /**
     * @Event
     */

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
            translateX: props.frame.left,
            translateY: props.frame.top,
          }),
          width: props.frame.width,
          height: props.frame.height,
        }}
        onClick={(e) => e.stopPropagation()}
        onMousedown={() => props.dialog.sortToRight(props.frame.id)}
      >
        <div
          class={{
            'absolute inset-0 overflow-auto': props.frame.width !== 'auto' && props.frame.height !== 'auto',
          }}
        >
          {context.slots.default && context.slots.default()}
        </div>
        {props.frame.isResize ? (
          <>
            <div
              class="absolute -top-2 left-0 right-0 h-4 cursor-ns-resize"
              onClick={(e) => e.stopPropagation()}
              draggable={true}
              onDragstart={(e) => props.dialog.onDragstart(e, props.frame, EventType.RESIZE_TOP)}
            ></div>
            <div
              class="absolute -bottom-2 left-0 right-0 h-4 cursor-ns-resize"
              onClick={(e) => e.stopPropagation()}
              draggable={true}
              onDragstart={(e) => props.dialog.onDragstart(e, props.frame, EventType.RESIZE_BOTTOM)}
            ></div>
            <div
              class="absolute -right-2 top-0 bottom-0 w-4 cursor-ew-resize"
              onClick={(e) => e.stopPropagation()}
              draggable={true}
              onDragstart={(e) => props.dialog.onDragstart(e, props.frame, EventType.RESIZE_RIGHT)}
            ></div>
            <div
              class="absolute -left-2 top-0 bottom-0 w-4 cursor-ew-resize"
              onClick={(e) => e.stopPropagation()}
              draggable={true}
              onDragstart={(e) => props.dialog.onDragstart(e, props.frame, EventType.RESIZE_LEFT)}
            ></div>
          </>
        ) : null}
      </div>
    );

    return (v) => {
      vm.value = v;

      return render();
    };
  },
});
