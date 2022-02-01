import { defineComponent, PropType } from 'vue';
import { FrameComponentInstance } from './types';
import { findParentComponent } from '/@/vue/utils';
import { DragEventType } from '/@/enum';
import Frame from './Frame';
import css from '/@/style';

export default defineComponent({
  name: 'bam-frame-resize',

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
    const onDragstart = (FrameComponent: FrameComponentInstance, type: DragEventType) => {
      return (e) => {
        if (FrameComponent) {
          FrameComponent.dialog.onDragstart(e, FrameComponent.frame.id, type);
        }
      };
    };
    // const onTouchstart = (FrameComponent: FrameComponentInstance, type: DragEventType) => {
    //   return (e) => {
    //     if (FrameComponent) {
    //       FrameComponent.dialog.onTouchstart(e, FrameComponent.frame.id, type);
    //     }
    //   };
    // };

    const FrameComponent = findParentComponent<FrameComponentInstance>(Frame);
    /**
     * @Render
     */
    return () => {
      if (FrameComponent) {
        return (
          <>
            <props.tag
              class={{
                [css.dialog_resize_mode]:
                  FrameComponent.frame.width !== 'auto' && FrameComponent.frame.height !== 'auto',
              }}
            >
              {context.slots.default && context.slots.default()}
            </props.tag>
            {FrameComponent.frame.isResizable ? (
              <>
                <div
                  class={css.dialog_resize_top}
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, DragEventType.RESIZE_TOP)}
                ></div>
                <div
                  class={css.dialog_resize_bottom}
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, DragEventType.RESIZE_BOTTOM)}
                ></div>
                <div
                  class={css.dialog_resize_right}
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, DragEventType.RESIZE_RIGHT)}
                ></div>
                <div
                  class={css.dialog_resize_left}
                  onClick={(e) => e.stopPropagation()}
                  draggable={true}
                  onDragstart={onDragstart(FrameComponent, DragEventType.RESIZE_LEFT)}
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
