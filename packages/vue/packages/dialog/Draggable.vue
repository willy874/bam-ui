<script lang="ts">
import { defineComponent, h, PropType } from 'vue';
import { FrameComponentInstance } from './types';
import { findParentComponent } from '../other/utils';
import { DragEventType } from '@core/enum';
import Frame from './Frame.vue';

export default defineComponent({
  name: 'bam-frame-draggable',

  props: {
    tag: {
      type: String as PropType<keyof HTMLElementTagNameMap & string>,
      default: 'div',
    },
  },

  setup(props, context) {
    const FrameComponent = findParentComponent<FrameComponentInstance>(Frame);
    /**
     * @Render
     */
    return () => {
      if (FrameComponent) {
        return h(
          props.tag,
          {
            style: { cursor: FrameComponent.frame.isDraggable && 'move' },
            draggable: true,
            onDragstart: (e) => FrameComponent.frame.onDragstart(e, DragEventType.DRAG_MOVE),
            onTouchstart: (e) => FrameComponent.frame.onDragstart(e, DragEventType.DRAG_MOVE),
          },
          [context.slots.default && context.slots.default()],
        );
      }
      return null;
    };
  },
});
</script>
