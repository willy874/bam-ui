import { ref, onMounted, onUpdated, onUnmounted, computed, defineComponent } from 'vue';
import type { DefineComponent, PropType } from 'vue';
// import { EventType } from '../types';
import Dialog from '../core/dialog';
import Frame from '../core/frame';
import { getFrameData, getFrameMethods } from '../core/interface';
import { getTransformStyleString } from '../utils';

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

  setup(props, context) {
    const vm = ref(null);

    /**
     * @Created
     */
    if (props.dialog.isBackgroundMask && props.frame.hook.bgclick.length === 0) {
      props.frame.on('bgclick', () => props.frame.onClose(props.dialog));
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
    onMounted(() => props.frame.onMount(vm.value));
    onUpdated(() => props.frame.onUpdate(vm.value));
    onUnmounted(() => props.frame.onUnmount(vm.value));

    /**
     * @Render
     */
    return (v) => {
      vm.value = v;
      const View = props.view;
      return (
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
          <View
            class="h-full w-full"
            frame-data={frameData}
            frame-methods={frameMethods}
            frame-props={props.frame.props}
          />
        </div>
      );
    };
  },
});
