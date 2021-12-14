<script setup lang="ts">
import 'virtual:windi.css'
import { h } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { VueDialog, useDialog } from './components/dialog/vue'

const onOpenDialog = async () => {
  const dialog = useDialog()
  const view = { setup() { return () => h('div', {
    style: {
      background: '#fff',
      width: '100px',
      height: '100px'
    }
  }, '') } }
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
    <VueDialog />
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
