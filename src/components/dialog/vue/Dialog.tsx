import {
  ref,
  reactive,
  computed,
  onMounted,
  onUpdated,
  onUnmounted,
  defineComponent,
  getCurrentInstance,
  markRaw,
} from 'vue';
import Frame from '../core/frame';
import FrameComponent from './Frame';
import { createDialog } from '../core/control';

export default defineComponent({
  name: 'bam-dialog',

  components: { BanFrame: FrameComponent },

  props: {
    name: {
      type: String,
      default: 'Dialog',
    },
    backgroundMask: {
      type: String,
      default: 'transparent',
    },
    isBackgroundMask: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, { emit, expose }) {
    const instance = getCurrentInstance();
    /**
     * @Data
     */
    const id = ref(Symbol(props.name));
    const native = createDialog({
      id: id.value,
      isBackgroundMask: props.isBackgroundMask,
      hook: {
        mount: (...args: any[]) => emit('mount', ...args),
        unmount: (...args: any[]) => emit('unmount', ...args),
        update: (...args: any[]) => emit('update', ...args),
        bgclick: (...args: any[]) => emit('bgclick', ...args),
      },
    });
    const dialog = reactive(native);
    expose({
      id,
      dialog,
    });

    /**
     * @Create
     */
    const isBackgroundMask = computed(() => props.isBackgroundMask && dialog.frames.length);

    /**
     * @Event
     * 使用 Proxy 綁定事件
     */
    const onClick = (e: PointerEvent) => dialog.onBgclick(e);
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
    onUpdated(() => dialog.onUpdate(instance));
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
        ref={(e: Element) => dialog.setRootElement(e)}
        class={{
          'fixed inset-0': true,
          'pointer-events-auto': isBackgroundMask.value,
          'pointer-events-none': !isBackgroundMask.value,
          'opacity-0': !dialog.frames.length,
        }}
      >
        <div class="absolute inset-0" style={{ background: props.backgroundMask }}></div>
        {dialog.frames.map((frame: Frame, index: number) => {
          const target = native.getFrame(frame.id);
          const View = markRaw(defineComponent(target?.view as object));
          return View ? <ban-frame key={frame.id} z-index={index} frame={frame} dialog={dialog} view={View} /> : null;
        })}
      </div>
    );
  },
});
