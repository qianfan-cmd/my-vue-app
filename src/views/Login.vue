<template>
<div class="body-login">
    <el-form :model="loginForm" class="login-container">
        <h1>欢迎登录</h1>
        <el-form-item>
            <el-input type="input" placeholder="请输入账号" v-model="loginForm.username">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password" placeholder="请输入密码" v-model="loginForm.password">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script setup>
import {ref,getCurrentInstance} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import {useAllDataStore} from '@/stores'

const route = useRoute();
const router = useRouter();

const loginForm = ref({
    username:'',
    password:'',
})

const store = useAllDataStore();
const {proxy} = getCurrentInstance();
const handleLogin = async () => {
    const res = await proxy.$api.getMenu(loginForm.value);
    console.log(res);
    // 拿到菜单以后，在哪里显示
    store.updateMenuList(res.menuList);//把展示菜单传递给pinia
    store.state.token = res.token;
    store.addMenu(router);//添加动态路由
    router.push('home');//登录成功进入主页

}
</script>

<style lang="less" scoped>
.body-login{
    display: flex;
    justify-content: center;
    align-items: center;
    width:100%;
    height:100vh;
    background-image:url("../assets/images/user.png");
    background-size:200px 200px;
    background-color:rgba(0,0,0,0.4);
    overflow:hidden;
    position:relative;
    &::before{/**这是一个伪元素，要写在body-login下，不然会覆盖掉登录页 */
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.4);
    z-index:1;
}
}

.login-container{
    position:relative;/**确保在遮罩层上方 */
    z-index:2;/**高于遮罩层 */
    width:350px;
    background-color: rgba(255,255,255,0.9);
    border:1px solid #eaeaea;
    border-radius:15px;
    padding:10px 30px 10px 30px;
    box-shadow:0 0 25px #cacaca;
    margin:25px auto;
    h1{
        text-align: center;
        margin-bottom:20px;
        color:#505450;
    }
    :deep(.el-form-item__content){
        justify-content:center;
        width:50px;
        height:30px;
    }
}
</style>