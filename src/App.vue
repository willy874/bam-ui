<script setup lang="tsx">
import 'virtual:windi.css'
import HelloWorld from './components/HelloWorld.vue'
import { VueDialog, useDialog, FrameDraggable } from './components/dialog/vue'

const onOpenDialog = async () => {
  const dialog = useDialog()
  const view = {
    props: {
      frameId: {
        type: Symbol,
        required: true
      }
    },
    setup(props) {
      return () => (
        <div
          class="p-4" 
          style={{
            background: '#fff',
            width: '100px',
            height: '100px',
            border: '1px solid #000'
          }}
        >
          <button onClick={() => dialog.closeFrame(props.frameId)}>關閉</button>
          <div class="py-2"></div>
          <FrameDraggable>拖拉</FrameDraggable>
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
    <!-- <VueDialog background-mask="#00000044" /> -->
    <VueDialog :is-background-mask="false" />
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
