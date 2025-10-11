import { createApp } from 'vue'

import { createPinia } from 'pinia'
import App from './App.vue'
import "@/assets/less/index.less";
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/api/mock.js";
import api from '@/api/api.js'
import 'element-plus/dist/index.css'
import { useAllDataStore } from './stores' 

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//路由持久化 我们要在use(router)之前拿到路由的数据 要放在use(pinia)之后写
const store = useAllDataStore();
store.addMenu(router,"refresh");//refresh是属性
app.config.globalProperties.$api = api;
app.use(router).mount("#app");
