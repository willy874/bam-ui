<script setup lang="tsx">
import { ref, PropType } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { VueDialog, useDialog, FrameDraggable, FrameResize, FrameMethods, FrameData } from './packages/dialog/vue'

const onOpenDialog = async () => {
  const dialog = useDialog()
  const text = ref('測試巴拉巴拉')

  const view = {
    props: {
      frameData: {
        type: Object as PropType<FrameData>,
        required: true
      },
      frameMethods: {
        type: Object as PropType<FrameMethods>,
        required: true
      },
      frameProps: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props) {
      const d = useDialog()
      console.log(props);
      
      return () => (
        <div
          style={{
            background: '#fff',
            border: '1px solid #000'
          }}
        >
          <FrameResize>
            <div
              style={{
                padding: '4rem',
              }}
            >
              <button onClick={() => dialog.closeFrame(props.frameData.id)}>關閉</button>
              <div class="py-2"></div>
              <button type="button" onClick={() => d.openFrame({ view })}>打開</button>
              <div class="py-2"></div>
              <button type="button" onClick={() => props.frameMethods.setFull(!props.frameData.isFull)}>全畫面</button>
              <div class="py-2"></div>
              <FrameDraggable>拖拉</FrameDraggable>
              <div class="py-2"></div>
              <div>{text.value}</div>
            </div>
          </FrameResize>
        </div>
      )
    }
  }
  

  console.log(await dialog.openFrame({ view }));
}
</script>

<template>
  <div>
    <div>
      <img alt="Vue logo" src="./assets/logo.png" />
      <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
      <button type="button" @click="onOpenDialog">打開</button>
      <div>123</div>
    </div>
    <VueDialog background-mask="#00000044" />
    <!-- <VueDialog :is-background-mask="false" /> -->
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: $test;
}
</style>
