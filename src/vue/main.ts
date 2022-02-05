import { createApp } from 'vue';
import App from './App.vue';
import { bamInit } from '@vue-dist/bam-ui.es';
import '@style';

createApp(App).use(bamInit).mount('#app');
