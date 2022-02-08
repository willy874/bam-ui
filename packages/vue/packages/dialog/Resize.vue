<script lang="ts">
 import { defineComponent, h, PropType } from 'vue';
import { DragEventType } from '@core/enum';
import { getClassNames as css } from '@core/style';
import Frame from './Frame.vue';
import { FrameComponentInstance } from './types';
import { findParentComponent } from '../other/utils';

export default defineComponent({
  name: 'bam-frame-resize',

  props: {
    tag: {
      type: String as PropType<keyof HTMLElementTagNameMap & string>,
      default: 'div',
    },
  },

  setup(props, context) {
    const FrameComponent = findParentComponent<FrameComponentInstance>(Frame);

    const resizeData = [
      { class: css().dialog_resize_top, type: DragEventType.RESIZE_TOP },
      { class: css().dialog_resize_bottom, type: DragEventType.RESIZE_BOTTOM },
      { class: css().dialog_resize_right, type: DragEventType.RESIZE_RIGHT },
      { class: css().dialog_resize_left, type: DragEventType.RESIZE_LEFT },
    ];

    const renderResize = () =>
      resizeData.map((data) =>
        h('div', {
          class: data.class,
          onClick: (e) => e.stopPropagation(),
          draggable: true,
          onDragstart: (e) => FrameComponent?.frame.onDragstart(e, data.type),
        }),
      );
    /**
     * @Render
     */
    return () => {
      if (FrameComponent) {
        return [
          h(
            props.tag,
            {
              class: {
                [css().dialog_resize_mode]:
                  FrameComponent.frame.width !== 'auto' && FrameComponent.frame.height !== 'auto',
              },
            },
            [context.slots.default && context.slots.default()],
          ),
          FrameComponent.frame.isResizable ? renderResize() : null,
        ];
      } else {
        return context.slots.default && context.slots.default();
      }
    };
  },
});
 
</script>