<script setup lang="ts">
import { PropType } from 'vue';
import { useDialog, BamFrameResize, BamFrameDraggable, getFrameData, getFrameMethods } from '@vue-dist/bam-ui.es'

const props = defineProps({
  frameData: Object as PropType<ReturnType<typeof getFrameData>>,
  frameMethods: Object as PropType<ReturnType<typeof getFrameMethods>>,
  frameProps: {
    type: Object as PropType<unknown>,
    default: () => ({})
  },
})
const dialog = useDialog()

const onClose = () => {
  dialog.closeFrame(props.frameData?.id)
  console.log(dialog.frames);
}

</script>

<template>
  <div class="view">
    <BamFrameResize>
      <div style="padding: 4rem;">
        <button @click="onClose">關閉</button>
        <div class="py-2"></div>
        <BamFrameDraggable>拖拉</BamFrameDraggable>
        <div class="py-2"></div>
      </div>
    </BamFrameResize>
  </div> 
</template>

<style scoped>
.view {
  background-color: aliceblue;
}
</style>
