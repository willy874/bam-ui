import { defineComponent } from 'vue';
import { FrameComponentInstance } from './types';
import { EventType } from '../types';
import { findParentComponent } from './utils';
import Frame from './Frame';

export default defineComponent({
  name: 'bam-frame-resize',

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

    /**
     * @Event
     */
    const onDragstart = (FrameComponent: FrameComponentInstance, type: EventType) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onDragstart(e, FrameComponent.frame, type);
        }
      };
    };
    const onTouchstart = (FrameComponent: FrameComponentInstance, type: EventType) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onTouchstart(e, FrameComponent.frame, type);
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
          <>
            <div
              class={{
                'absolute inset-0 overflow-auto overscroll-none scroll-smooth':
                  FrameComponent.frame.width !== 'auto' && FrameComponent.frame.height !== 'auto',
              }}
            >
              {context.slots.default && context.slots.default()}
            </div>
            {FrameComponent.frame.isResizable ? (
              <>
                <div
                  class="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize"
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, EventType.RESIZE_TOP)}
                ></div>
                <div
                  class="absolute -bottom-1 left-0 right-0 h-2 cursor-ns-resize"
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, EventType.RESIZE_BOTTOM)}
                ></div>
                <div
                  class="absolute -right-1 top-0 bottom-0 w-2 cursor-ew-resize"
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, EventType.RESIZE_RIGHT)}
                ></div>
                <div
                  class="absolute -left-1 top-0 bottom-0 w-2 cursor-ew-resize"
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, EventType.RESIZE_LEFT)}
                ></div>
              </>
            ) : null}
          </>
        );
      }
      return context.slots.default && context.slots.default();
    };
  },
});
