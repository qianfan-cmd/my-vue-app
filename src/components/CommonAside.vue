<template>
    <el-aside width="width"><!--因为会折叠，所以宽度也是动态的 default-active是默认选择的意思-->
        <el-menu 
        background-color="#545c64"
        text-color="#fff"
        :collapse="isCollapse"
        :default-active="activeMenu"
        ><!-- ture时折叠-->
       
            <h3 v-show="!isCollapse">通用后台管理系统</h3>
            <!-- 遍历渲染导航栏标题 -->
            <el-menu-item 
            v-for="(item) in noChildren" 
            :index="item.path" 
            :key="item.path"
            @click="handleMenu(item)"
            >
                <!-- 动态取得图标 -->
                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>

            <!-- 有子菜单的遍历 -->
            <el-sub-menu 
            v-for="item in hasChildren" 
            :index="item.path" 
            :key="item.path"
            >
                <template #title>
                    <component class="icons" :is="item.icon"></component>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item 
                    v-for="(subItem,subIndex) in item.children" 
                    :index="subItem.path" 
                    :key="subItem.path"
                    @click="handleMenu(subItem)"
                    >
                    <component class="icons" :is="subItem.icon"></component>
                    <span>{{ subItem.label }}</span>
                </el-menu-item>
                </el-menu-item-group>

                <!-- 三级菜单 -->
                <!--<el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group> -->

                <!-- <el-sub-menu index="1-4">
               <template #title>item four</template>
               <el-menu-item index="1-4-1">item one</el-menu-item>
               </el-sub-menu> -->
            </el-sub-menu>


        </el-menu>
    </el-aside>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useAllDataStore } from '@/stores';
import { useRouter,useRoute } from 'vue-router'

//定义一个router对象
// const list = ref([
//     {
//         path: '/home',
//         name: 'home',
//         label: '首页',
//         icon: 'house',
//         url: 'Home',
//     },
//     {
//         path: '/mall',
//         name: 'mall',
//         label: '商品管理',
//         icon: 'video-play',
//         url: 'Mall'
//     },
//     {
//         path: '/user',
//         name: 'user',
//         label: '用户管理',
//         icon: 'user',
//         url: 'User',
//     },
//     {
//         path: 'other',
//         name: 'other',
//         label: '其他',
//         icon: 'location',
//         children: [
//             {
//                 path: '/page1',
//                 name: 'page1',
//                 label: '页面1',
//                 icon: 'setting',
//                 url: 'Page1'
//             },
//             {
//                 path: '/page2',
//                 name: 'page2',
//                 label: '页面2',
//                 icon: 'setting',
//                 url: 'Page2'
//             },
//         ]
//     }
// ])

//动态菜单
const list = computed(()=>store.state.menuList);

//用计算属于来包裹逻辑
const noChildren = computed(() => list.value.filter(item => !item.children));
const hasChildren = computed(() => list.value.filter(item => item.children));

//计算是否折叠
const store = useAllDataStore();
const isCollapse = computed(() => store.state.isCollapse);
const width = computed(()=>store.store.isCollapse?'64px':'180px');

/**
 * useRouter常用方法
 * push():跳转到新页面
 * replace():替换当前页面
 * go():前进或后退页面
 * back():返回上一页
 */
const router = useRouter();//获取路由控制器，返回路由实例对象
const route = useRoute();//获取当前页面的路由信息，返回包含当前路由信息的对象
const activeMenu = computed(()=>route.path);
const handleMenu = (item) => {
    console.log("当前的页面信息是route：",route);
    console.log("useRouter 路由实例对象:",router);
    router.push(item.path);//点击对应页面后触发push()方法，根据对应的路径跳转到对应页面
    store.selectMenu(item);
}

</script>

<style lang="less" scoped>
.icons{
    width:20px;
    height:18px;
    margin-right:5px !important;
    display:inline-block;

}

:deep(.el-menu){
    border-right:none;
    background-color: #545c64;
    h3{
        width:180px;
        font-size: medium;
        line-height:15px;
        color:#fff;
        text-align: center;
        // background-color: #409eff; /* 标题栏蓝色背景（可选，视频常见样式） */
    }
}
.el-aside{
    height:100vh;
    background-color: #545c64;
}
</style>