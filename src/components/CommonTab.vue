<template>
   <div class="tags">
    <!--closable表示是否课关闭-->
    <el-tag
    v-for="(tag,index) in tags"
    :key="tag.name"
    :closable="tag.name !== 'home'" 
    :effect="route.name === tag.name ? 'dark' : 'plain' "
    @click="handleMenu(tag)"
    @close="handleClose(tag,index)"
    >
    {{ tag.label }}
    </el-tag>
   </div>
</template>

<script setup>
import {ref,computed} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {useAllDataStore} from '@/stores'

const store = useAllDataStore();
const tags = computed(()=>store.state.tags);
// const tags = ref([
//     {
//        path:"/home",
//        name:'home',
//        label:'首页',
//        icon:'home'
//     }
// ])
const route = useRoute();
const router = useRouter();
const handleMenu = (tag) =>{
    router.push(tag.path);
}
const handleClose = (tag,index) => {
    //通过pinia管理
    store.updateTags(tag);

    //如果点击关闭的tag，不是对应的当前界面
    if(route.name !== tag.name){
        return;//直接不管
    }
    //如果关闭的是最后一个标签
    if(index === store.state.tags.length){
        //console.log("最后一个",index);index从0开始
        store.selectMenu(tags.value[index-1]);//确保跳转到上一个标签里
        router.push(tags.value[index-1].name);
    }else{
         store.selectMenu(tags.value[index]);//跳转到上一个页面
         router.push(tags.value[index].name);
    }
    

}
</script>

<style lang="less" scoped>
.tags{
    margin:10px 0 0 30px; /**上 右 下 左 */
    cursor:pointer;
}
.el-tag{
    margin-right:10px;
    
}
</style>