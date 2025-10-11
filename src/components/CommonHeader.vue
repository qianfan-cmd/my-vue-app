<template>

    <div class="header">
        <div class="l-content">
            <el-button size="small">
                <component class="icons" :is="Operation" @click="Collapse"></component>
            </el-button>
            <!-- 面包屑，就是顶部导航栏的意思 -->
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
         <el-dropdown>
    <span class="el-dropdown-link">
      <!-- 动态图片 
       不能直接写src=""这回被当作静态字符串
       动态内容要写动态绑定语法:src=""才能执行函数-->
       <img :src="getImageUrl('user')" class="user"/>
      
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>

      </el-dropdown-menu>
    </template>
  </el-dropdown>
        </div>
    </div>

</template>

<script setup>
import { ref,computed } from 'vue'
import { Menu, Operation } from '@element-plus/icons-vue'
import { useAllDataStore } from '../stores';
import {useRouter} from 'vue-router'

const getImageUrl = (user) => {
    //URL(url,base) 相对路径,绝对路径
    return new URL(`../assets/images/${user}.png`,import.meta.url).href;
}

//折叠
const store = useAllDataStore();
const Collapse = () => {
    store.state.isCollapse = !store.state.isCollapse;
}

const router = useRouter();
const handleLoginOut = () => {
    //退出就是重置数据
    store.clean();
   router.push('/login');
}
</script>

<style lang="less" scoped>
.header{
    display:flex;
    justify-content:space-between;//水平方向上将子元素均匀分配在容器内，第一个在起始段，最后一个在最末端
    align-items: center;
    width:100%;
    height:100%;
    background-color: #333;
}
//el-button自带白色背景和内边距，不改变颜色的话会使得图标两侧有白色空隙
.el-button{
    background-color: #333;
    border:none;
}
//图标显示有问题的时候就import一下
.icons{
    width:20px;
    height:20px;
    color:#fff;
    background-color: #333;
}
.icons:hover{
    color:#409eff;
}
.l-content{
    display:flex;
    align-items:center;
    .el-button{
        margin-right:20px;
    }
}
.r-content{
    .user{
    width:40px;
    height:40px;
    border-radius:50%;
    }
    .el-dropdown-link{
    border-radius:50%;
    }
}
//也可以用span来代替.el-breadcrumb__inner，因为内部结构是span构成的，但是最好别用
:deep(.bread .el-breadcrumb__inner){
    //!important强制覆盖,不用的话鼠标放上去会变背景色,提高优先级强制覆盖
    color:#fff !important;
    cursor:pointer !important;
}
</style>