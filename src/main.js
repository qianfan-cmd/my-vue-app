import { createApp } from 'vue'

import { createPinia } from 'pinia'
import App from './App.vue'
import "@/assets/less/index.less";
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/api/mock.js";
import api from '@/api/api.js'
import 'element-plus/dist/index.css'


const app = createApp(App);

const pinia = createPinia();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$api = api;
app.use(router).use(pinia).mount("#app");
