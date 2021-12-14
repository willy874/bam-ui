import { ref, reactive, onMounted, onUpdated, onUnmounted, defineComponent, markRaw } from 'vue';
import Frame from '../core/frame';
import FrameComponent from './Frame';
import { create } from '../core/control';

export default defineComponent({
  name: 'bam-dialog',

  components: { BanFrame: FrameComponent },

  props: {
    name: {
      type: String,
      default: 'Dialog',
    },
    zIndex: {
      type: Object,
      default: () => ({}),
    },
    backgroundMask: {
      type: String,
      default: '#00000044',
    },
  },

  setup(props, context) {
    /**
     * @Data
     */
    const id = ref(Symbol(props.name));
    const vm = ref(null);
    const native = create({
      id: id.value,
      zIndex: props.zIndex,
      hook: {
        mount: (...args: any[]) => context.emit('mount', ...args),
        unmount: (...args: any[]) => context.emit('unmount', ...args),
        update: (...args: any[]) => context.emit('update', ...args),
        resize: (...args: any[]) => context.emit('resize', ...args),
      },
    });
    const dialog = reactive(native);

    /**
     * @Lifecycle
     */
    onMounted(() => dialog.onMount(vm.value));
    onUpdated(() => dialog.onUpdate(vm.value));
    onUnmounted(() => dialog.onUnmount(vm.value));

    /**
     * @Render
     */
    const renderFrameItem = (frame: Frame, index: number) => {
      const target = native.getFrame(frame.id);
      const View = defineComponent(target?.view as object);
      return View ? (
        <ban-frame key={frame.id} z-index={dialog.zIndex.frame + index} frame={frame} dialog={dialog}>
          <View>{frame.id}</View>
        </ban-frame>
      ) : null;
    };
    const render = () => (
      <div
        ref={(e: Element) => dialog.setRootElement(e)}
        class={{
          'fixed inset-0': true,
          'pointer-events-auto': dialog.frames.length,
          'opacity-0 pointer-events-none': !dialog.frames.length,
        }}
        onClick={(e: PointerEvent) => dialog.onBgClick(e)}
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
