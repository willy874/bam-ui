<script setup lang="ts">
import { PropType } from 'vue';
import { useDialog, BamFrameResize, BamFrameDraggable, FrameData } from './dialog'
const props = defineProps({
  data: Object as PropType<FrameData>
})

const dialog = useDialog()
const onClose = () => dialog.closeFrame(props.data?.id)

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
.box {
  background-color: aqua;
  width: 100px;
  height: 100px;
}

</style>
