<script setup>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'
import CommonTab from '../components/CommonTab.vue'
</script>

<template>
  <div class="common-layout">
       <el-container class="lay-container">
          <!-- 自定义左侧组件 -->
           <CommonAside/>

           <!-- 右侧组件用container包裹 -->
           <el-container>
              <el-header>
                <!-- 自定义头部组件 -->
                <CommonHeader/>
              </el-header>

              <CommonTab/>
              <!-- 这里面显示的是页面的主要内容 -->
              <el-main class="right-main">
                  <router-view></router-view>
              </el-main>

           </el-container>

       </el-container>

  </div>
</template>

<style scoped lang="less">
    .common-layout,.lay-container{
      height:100%;

    }
    .el-header{
      background-color: #333;
    }

</style>
