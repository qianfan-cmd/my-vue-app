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
//路由守卫 用isRoute方法判断要跳转的路由是否存在
function isRoute(to){
  let res = router.getRoutes();
  let resFil = res.filter(item=>item.path === to.path);
  return resFil.length > 0;//代表页面存在
}
//用router.beforeEach((to,from)注册全局前置路由守卫，to是目标页面，from是当前要离开的页面
//守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。
/**
 * 触发顺序：在一个导航触发时，全局前置路由守卫按创建顺序被调用。如果用router.beforeResolve
 * 守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用.更多守卫见路由守卫官方文档
 * 返回值
 * false:取消当前的导航，返回from页面
 * 一个路由地址：
 */
router.beforeEach((to,from)=>{
  //如果要跳转的页面不是login并且通过token是否存在判断用户是否登录，没登录就跳转到login
  if(to.path !== "/login" && !store.state.token) {
    return {name:"login"};
  }
  //如果路由记录不存在跳转到404
  if(!isRoute(to)){
    return {name:'404'};
  }
})
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
//拿到404
for(const [key,component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key,component);
}
