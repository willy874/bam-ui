<script setup lang="tsx">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { VueDialog, useDialog, FrameDraggable, FrameResize } from './components/dialog/vue'

const onOpenDialog = async () => {
  const dialog = useDialog()
  const text = ref('123')
  setTimeout(() => {
    text.value = 'HelloHelloHelloHelloHelloHelloHelloHelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello '
  }, 3000)

  const view = {
    props: {
      frameData: {
        type: Object,
        required: true
      },
      frameMethods: {
        type: Object,
        required: true
      },
      frameProps: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props) {
      const d = useDialog()
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
