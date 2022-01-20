import { defineComponent } from 'vue';
import { FrameComponentInstance } from './types';
import { EventType } from '../types';
import { findParentComponent } from './utils';
import Frame from './Frame';

export default defineComponent({
  name: 'bam-frame-draggable',

  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },

  setup(props, context) {
    /**
     * @Created
     */
    console.log(props);

    /**
     * @Event
     */
    const onDragstart = (FrameComponent?: FrameComponentInstance) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onDragstart(e, FrameComponent.frame, EventType.DRAG_MOVE);
        }
      };
    };
    const onTouchstart = (FrameComponent?: FrameComponentInstance) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onTouchstart(e, FrameComponent.frame, EventType.DRAG_MOVE);
        }
      };
    };

    const FrameComponent = findParentComponent<FrameComponentInstance>(Frame);
    /**
     * @Render
     */
    return () => {
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
