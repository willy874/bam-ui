import { ref, defineComponent } from 'vue';
import { FrameComponentType } from './types';
import { EventType } from '../types';
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
    const onDragstart = (FrameComponent?: FrameComponentType) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onDragstart(e, FrameComponent.frame, EventType.DRAG_MOVE);
        }
      };
    };
    const onTouchstart = (FrameComponent?: FrameComponentType) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onTouchstart(e, FrameComponent.frame, EventType.DRAG_MOVE);
        }
      };
    };

    /**
     * @Render
     */
    return (v) => {
      vm.value = v;
      const FrameComponent = findFrame(v);
      if (FrameComponent) {
        return (
          <div
            class={{ 'cursor-move': FrameComponent.frame.isDraggable }}
            draggable={true}
            onDragstart={onDragstart(FrameComponent)}
            onTouchstart={onTouchstart(FrameComponent)}
          >
            {context.slots.default && context.slots.default()}
          </div>
        );
      }
      return null;
    };
  },
});
