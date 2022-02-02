import { defineComponent, PropType } from 'vue';
import { FrameComponentInstance } from './types';
import { findParentComponent } from '../other/utils';
import { DragEventType } from '@core/enum';
import Frame from './Frame';

export default defineComponent({
  name: 'bam-frame-draggable',

  props: {
    tag: {
      type: String as PropType<keyof HTMLElementTagNameMap & string>,
      default: 'div',
    },
  },

  setup(props, context) {
    /**
     * @Event
     */
    const onDragstart = (FrameComponent?: FrameComponentInstance) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onDragstart(e, FrameComponent.frame.id, DragEventType.DRAG_MOVE);
        }
      };
    };
    const onTouchstart = (FrameComponent?: FrameComponentInstance) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onTouchstart(e, FrameComponent.frame.id, DragEventType.DRAG_MOVE);
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
          <props.tag
            style={{ cursor: FrameComponent.frame.isDraggable && 'move' }}
            draggable={true}
            onDragstart={onDragstart(FrameComponent)}
            onTouchstart={onTouchstart(FrameComponent)}
          >
            {context.slots.default && context.slots.default()}
          </props.tag>
        );
      }
      return null;
    };
  },
});
