import {
  computed,
  onMounted,
  onUpdated,
  onUnmounted,
  defineComponent,
  getCurrentInstance,
  markRaw,
  PropType,
  isReactive,
} from 'vue';
import { Dialog, DialogOptions } from 'bam-ui/packages/core/src/index';
import css from 'bam-ui/packages/core/dist/index.css';
import VueDialog from './dialog-class';
import Frame from './frame-class';
import { useFrame, createDialog, setDefaultDialog } from './utils';
import FrameComponent from './Frame';
import { AnyComponentPublicInstance } from './types';

export default defineComponent({
  name: 'BamDialog',

  props: {
    dialog: {
      type: Object as PropType<VueDialog | DialogOptions>,
      default: () => ({}),
    },
  },

  setup(props, { expose }) {
    const instance = getCurrentInstance();

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
      dialog.onMount(instance);
      document.body.addEventListener('click', onClick);
      document.body.addEventListener('dragover', onDragover);
      document.body.addEventListener('dragend', onDragend);
      document.body.addEventListener('touchmove', onTouchmove);
      document.body.addEventListener('touchend', onTouchend);
      window.addEventListener('resize', onResize);
    });
    onUpdated(() => {
      dialog.onUpdate(instance);
    });
    onUnmounted(() => {
      dialog.onUnmount(instance);
      document.body.removeEventListener('click', onClick);
      document.body.removeEventListener('dragover', onDragover);
      document.body.removeEventListener('dragend', onDragend);
      document.body.removeEventListener('touchmove', onTouchmove);
      document.body.removeEventListener('touchend', onTouchend);
      window.removeEventListener('resize', onResize);
    });

    /**
     * @Render
     */
    return () => (
      <div
        ref={(e: AnyComponentPublicInstance | Element) => dialog.setRootElement<AnyComponentPublicInstance>(e)}
        class={css.dialog}
        style={{
          pointerEvents: isBackgroundMask.value ? 'auto' : 'none',
          opacity: dialog.frames.length ? 1 : 0,
        }}
      >
        <div class={css.dialog_container} style={{ background: dialog.backgroundMask }}></div>
        {dialog.frames.map((frame, index: number) => {
          const target = useFrame(frame.id);
          if (target) {
            const View = markRaw(target.createVNode());
            return (
              <FrameComponent
                key={frame.id}
                z-index={index}
                frame={frame as Frame}
                dialog={dialog as VueDialog}
                view={View}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  },
});
