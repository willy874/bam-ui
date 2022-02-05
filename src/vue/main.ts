import { createApp } from 'vue';
import App from './App.vue';
import { bamInit } from '../../packages/vue';

createApp(App).use(bamInit).mount('#app');
