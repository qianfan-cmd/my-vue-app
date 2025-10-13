import { createRouter,createWebHashHistory } from 'vue-router'

//指定路由规则

const routes = [
    {
        path:'/',
        name:'main',
        component: () => import('@/views/Main.vue'),
        redirect:"/home",//重定向，默认显示home
        children:[]
    },
    {
        path:'/login',
        name:'login',
        component: () => import("@/views/Login.vue"),
    },
    {
        path:'/404',
        name:'404',
        component: () => import("@/views/404.vue"),
    },
];

//配置信息
const  router = createRouter({
    //设置路由模式
    history: createWebHashHistory(),
    routes,
});

export default router;