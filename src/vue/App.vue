<script setup lang="tsx">
import HelloWorld from './components/HelloWorld.vue'
import DialogView from './components/DialogView.vue'
import { BamDialog, createDialog, useDialog } from './components/dialog'

const onOpenDialog = async () => {
  const d = useDialog()
  const V = await d.openFrame({ view: DialogView })
  console.log(V);
}

const dialog = createDialog({
  backgroundMask: '#00000044',
  // isBackgroundMask: false
})
</script>

<template>
  <div>
    <div>
      <img alt="Vue logo" src="/@/assets/logo.png" />
      <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
      <button type="button" @click="onOpenDialog">打開</button>
      <div>123</div>
    </div>
    <BamDialog :dialog="dialog" />
    <!-- <BamDialog :is-background-mask="false" /> -->
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
