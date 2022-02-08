

<script lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  defineComponent,
  PropType,
  isReactive,
ComponentPublicInstance,
h,
} from 'vue';
import { Dialog, DialogOptions } from '@core/packages';
import { getClassNames as css } from '@core/style';
import { createDialog, setDefaultDialog } from './utils';
import FrameComponent from './Frame.vue';

export default defineComponent({
  name: 'bam-dialog',

  components: {
   FrameComponent 
  },

  props: {
    dialog: {
      type: Object as PropType<Dialog | DialogOptions>,
      default: () => ({}),
    },
  },

  setup(props, { expose }) {
    /**
     * @Data
     */
    const _dialog = props.dialog instanceof Dialog ? props.dialog : createDialog(props.dialog);
    const dialog = isReactive(_dialog) ? _dialog : setDefaultDialog(_dialog);

    expose({
      dialog,
    });

    /**
     * @Create
     */
    const isBackgroundMask = computed(() => dialog.isBackgroundMask && dialog.frames.length);

    /**
     * @Event
     * 使用 Proxy 綁定事件
     */
    const onClick = (e: MouseEvent) => dialog.onBgclick(e);
    const onDragover = (e: DragEvent) => dialog.onDragover(e);
    const onDragend = (e: DragEvent) => dialog.onDragend(e);
    const onTouchmove = (e: TouchEvent) => dialog.onTouchmove(e);
    const onTouchend = (e: TouchEvent) => dialog.onTouchend(e);
    const onResize = (e: Event) => dialog.onResize(e);

    /**
     * @Lifecycle
     */
    onMounted(() => {
      document.body.addEventListener('click', onClick);
      document.body.addEventListener('dragover', onDragover);
      document.body.addEventListener('dragend', onDragend);
      document.body.addEventListener('touchmove', onTouchmove);
      document.body.addEventListener('touchend', onTouchend);
      window.addEventListener('resize', onResize);
    });
    onUnmounted(() => {
      document.body.removeEventListener('click', onClick);
      document.body.removeEventListener('dragover', onDragover);
      document.body.removeEventListener('dragend', onDragend);
      document.body.removeEventListener('touchmove', onTouchmove);
      document.body.removeEventListener('touchend', onTouchend);
      window.removeEventListener('resize', onResize);
    });

    return () => h('div', {
      ref: (el: Element | ComponentPublicInstance | null) => dialog.setRootElement(el),
      class: css().dialog,
      style: { pointerEvents: isBackgroundMask.value ? 'auto' : 'none', opacity: dialog.frames.length ? 1 : 0 }
    }, [
      h('div', {
        class: css().dialog_container,
        style: { background: dialog.backgroundMask }
      }, (
        dialog.frames.map((frame, index) => h(FrameComponent, {
          key: frame.id,
          zIndex: index,
          frame,
          dialog
        }))
      ))
    ])
  },
});
</script>