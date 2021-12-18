import { ref, defineComponent } from 'vue';
import { findFrame } from './utils';

export default defineComponent({
  name: 'bam-frame-draggable',

  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },

  setup(props, context) {
    const vm = ref(null);

    /**
     * @Created
     */

    /**
     * @Event
     */
    const onDragstart = (e) => {
      if (vm.value) {
        const FrameComponent = findFrame(vm.value);
        if (FrameComponent) {
          FrameComponent.dialog.onDragstart(e, FrameComponent.frame);
        }
      }
    };
    const onTouchstart = (e) => {
      if (vm.value) {
        const FrameComponent = findFrame(vm.value);
        if (FrameComponent) {
          FrameComponent.dialog.onTouchstart(e, FrameComponent.frame);
        }
      }
    };

    /**
     * @Render
     */
    const render = () => (
      <div class={{ 'cursor-move': true }} draggable={true} onDragstart={onDragstart} onTouchstart={onTouchstart}>
        {context.slots.default && context.slots.default()}
      </div>
    );

    return (v) => {
      vm.value = v;

      return render();
    };
  },
});
