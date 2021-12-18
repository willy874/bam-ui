import { ref, reactive, computed, onMounted, onUpdated, onUnmounted, defineComponent } from 'vue';
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

  setup(props, context) {
    /**
     * @Data
     */
    const id = ref(Symbol(props.name));
    const vm = ref(null);
    const native = createDialog({
      id: id.value,
      isBackgroundMask: props.isBackgroundMask,
      hook: {
        mount: (...args: any[]) => context.emit('mount', ...args),
        unmount: (...args: any[]) => context.emit('unmount', ...args),
        update: (...args: any[]) => context.emit('update', ...args),
        resize: (...args: any[]) => context.emit('resize', ...args),
      },
    });
    const dialog = reactive(native);

    /**
     * @Create
     */
    const isBackgroundMask = computed(() => props.isBackgroundMask && dialog.frames.length);

    /**
     * @Event
     */
    const onClick = (e: PointerEvent) => dialog.onBgClick(e);
    const onDragover = (e: DragEvent) => dialog.onDragover(e);
    const onDragend = (e: DragEvent) => dialog.onDragend(e);
    const onTouchmove = (e: TouchEvent) => dialog.onTouchmove(e);
    const onTouchend = (e: TouchEvent) => dialog.onTouchend(e);

    /**
     * @Lifecycle
     */
    onMounted(() => {
      dialog.onMount(vm.value);
      document.body.addEventListener('click', onClick);
      document.body.addEventListener('dragover', onDragover);
      document.body.addEventListener('dragend', onDragend);
      document.body.addEventListener('touchmove', onTouchmove);
      document.body.addEventListener('touchend', onTouchend);
    });
    onUpdated(() => dialog.onUpdate(vm.value));
    onUnmounted(() => {
      dialog.onUnmount(vm.value);
      document.body.removeEventListener('click', onClick);
      document.body.removeEventListener('dragover', onDragover);
      document.body.removeEventListener('dragend', onDragend);
      document.body.removeEventListener('touchmove', onTouchmove);
      document.body.removeEventListener('touchend', onTouchend);
    });

    /**
     * @Render
     */
    const renderFrameItem = (frame: Frame, index: number) => {
      const target = native.getFrame(frame.id);
      const View = defineComponent(target?.view as object);
      return View ? (
        <ban-frame key={frame.id} z-index={index} frame={frame} dialog={dialog}>
          <View frame-id={frame.id} />
        </ban-frame>
      ) : null;
    };
    const render = () => (
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
        {dialog.frames.map(renderFrameItem)}
      </div>
    );

    return (v) => {
      vm.value = v;

      return render();
    };
  },
});
