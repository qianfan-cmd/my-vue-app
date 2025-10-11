import {defineStore} from 'pinia';
import {ref,watch} from 'vue'

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

    watch(state,(newObj)=>{
      if(!newObj.token) return;
      /**
       * 用localStorage将数据长期保存在本地
       * • 保存数据：localStorage.setItem(key,value);
       • 读取数据：localStorage.getItem(key);
       • 删除单个数据：localStorage.removeItem(key);
       • 删除所有数据：localStorage.clear();
       • 得到某个索引的key：localStorage.key(index);
       提示: 键/值对通常以字符串存储，你可以按自己的需要转换该格式。
       */
      localStorage.setItem('store',JSON.stringify(newObj));//将对象转换成字符串存储,两个参数组成键值对
   },
    {deep:true}//进行深度监听
   )

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
    const addMenu = (router,type) =>{
      if(type === "refresh"){
         if(JSON.parse(localStorage.getItem('store'))){
            state.value = JSON.parse(localStorage.getItem('store'));
            //
            state.value.routerList = [];
         }else{
            return;
         }
      }
      const menu = state.value.menuList;//拿到该用户的菜单
      /**
       *  [
             {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home'
            },]
       */
      const module = import.meta.glob('../views/**/*.vue');//这个是vite里的，**代表0个或多个文件
      /**
       * 对import.meta.glob()的代码解释
       * 作用：批量导入匹配指定模式的所有模块
       * return:Object,键是文件路径，值是返回Promise的导入函数
       * 
       * glob模式是匹配符模式
       * '../views/**\/*.vue'解释
       * ../views/:从当前文件所在目录的上一级目录的views文件夹开始
       * **：匹配任意深度的子目录（也就是views下的所有目录
       * *.vue:匹配目录下的所有.vue文件
       * 执行后module类似
       * {
         '../views/home/index.vue': () => import('../views/home/index.vue'),
         '../views/about/index.vue': () => import('../views/about/index.vue'),
         '../views/user/profile.vue': () => import('../views/user/profile.vue'),
         // ... 所有匹配的 vue 文件
         }
       */
      
      //设置路由---------------------------------------------------------------
      const routeArr = [];//用于存储当前用户的菜单路由
      menu.forEach((item)=>{
         if(item.chlidren){//如果有子页,为子页添加对应的组件
            item.chlidreen.forEach(val=>{
            let url = `../views/${val.url}.vue`;//这里的url是对应组件的url../views/Home.vue
            val.component = module[url];//导入对应组件，导入了组件才知道显示什么内容
         });
          routeArr.push(...item.chlidren);//统一导入
         }else {//没子页就直接添加组件后添加进routeArr中
            let url = `../views/${item.url}.vue`;
            item.component = module[url];
            routeArr.push(item);
         }
      });

      //重置Route，修改多账户登录的bug------------------------------------------------------
      //router是外部传进来的路由控制器
      console.log(router.getRoutes());//查看当前路由
      let routers = router.getRoutes();//拿到当前用户菜单路由
      //多账号登录bug处理
      routers.forEach(item => {
         if(item.name === 'main' || item.name === 'login'){
            return;//保留默认页，不做处理
         }else {
            router.removeRoute(item.name);//移除路由
         }
      })
      //--------------------------------------------------------------

      routeArr.forEach(item=>{
         //addRoute是追加操作，不是替换，但是不会重复追加
         /**router.addRoute解释
          * 参数1：parentName-父级路由的名称（这里是main)
          * 参数2：要添加的路由配置对象
          * 代码含义：​​将 item路由添加到名为 "main"的路由的子路由中​
          * 
          */
         state.value.routerList.push(router.addRoute("main",item));
      })
    }

          //退出时对数据进行清除
      const clean = () => {
          state.value.routerList.forEach((item)=>{
            console.log(item);/**打印出来是() => {
            removeRoute(originalMatcher);
           }*/
            if(item) item();//所以item()就是清除路由了
          });
          state.value = initState();
          //删除本地缓存
          localStorage.removeItem('store');
      }
    //本来要return { count, name, doubleCount, increment }
    //这样子返回一大堆变量，定义一个初始化函数一起返回
    return {
        state,
        selectMenu,
        updateTags,
        updateMenuList,
        addMenu,
        clean,
    };
})