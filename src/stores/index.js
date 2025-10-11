import {defineStore} from 'pinia';
import {ref} from 'vue'

//初始化要传递的数据
function initState() {
    return {
       isCollapse:false,
       tags: [
    {
       path:"/home",
       name:'home',
       label:'首页',
       icon:'home'
    }
       ],
       currentMenu: null,
       menuList:[],
       token:"",
       routerList: [],
    };

}
//配置传递的数据，命名最好以use开头，store结尾
export const useAllDataStore = defineStore('content',() =>{
    //在setup store中
    //ref()就算state属性
    //computed()就算getters
    //function()就是actions
    const state = ref(initState());

    const selectMenu = (val) => {
      if(val.name === 'home'){
        state.value.currentMenu = null;
      }else{
        let index = state.value.tags.findIndex(item=>item.name === val.name);
        index === -1 ? state.value.tags.push(val) : "";//没有点击过就添加进去
      }
    }

    const updateTags = (tag) => {
       let index = state.value.tags.findIndex(item => item.name === tag.name);
       state.value.tags.splice(index,1);//splice(要删除的元素位置,要删除的元素数量)
    }

    const updateMenuList = (val) => {
      state.value.menuList = val;
    }
    
    //实现动态路由
    const addMenu = (router) =>{
      const menu = state.value.menuList;
      const module = import.meta.glob('../views/**/*.vue');//这个是vite里的，**代表0个或多个文件
      const routeArr = [];
      menu.forEach((item)=>{
         if(item.chlidren){
            item.chlidreen.forEach(val=>{
            let url = `../views/${val.url}.vue`;
            val.component = module[url];
            routeArr.push(...item.chlidren);
         })
         }else {
            let url = `../views/${item.url}.vue`;
            item.component = module[url];
            routeArr.push(item);
         }
      });

      console.log(router.getRoutes());//查看当前路由
      let routers = router.getRoutes();//拿到当前路由
      //多账号登录bug处理
      routers.forEach(item => {
         if(item.name === 'main' || item.name === 'login'){
            return;//不做处理
         }else {
            router.removeRoute(item.name);//移除路由
         }
      })
      routeArr.forEach(item=>{
         state.value.routerList.push(router.addRoute("main",item));
      })
    }
    //本来要return { count, name, doubleCount, increment }
    //这样子返回一大堆变量，定义一个初始化函数一起返回
    return {
        state,
        selectMenu,
        updateTags,
        updateMenuList,
        addMenu,
    };
})