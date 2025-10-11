import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/ 用于配置项目的构建行为

//定义并导出Vite的配置对象
export default defineConfig({
  plugins: [
    vue(),
 AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],//初始化vue插件

  //这个resolve是添加的路径别名
  resolve:{
    alias:[
      {
        find:"@",
        replacement:"/src"
      }
    ]
  }
})
