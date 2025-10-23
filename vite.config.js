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
  },
  //服务器配置
  server:{
    port:3000,//设置端口为3000
    open:true,//启动后自动打开浏览器

    //代理配置-解决开发环境跨域问题
    /**
     * 什么是跨域？
     * 跨域是浏览器的同源策略，它限制了一个源的文档或脚本如何与另一个
     * 源的资源进行交互。这是一个重要的安全机制，防止恶意的网站窃取用户信息。
     * 同源策略要求：协议、域名、端口三者必须完全相同
     */
    proxy:{
      '/api':{
        target:'http://localhost:8080',//后端服务器网址
        changeOrigin:true,//是否跨域
        /**
         * changeOrigin的作用
         * 设置为true时，代理会蟹盖请求头中的Origin字段，使其与目标服务器匹配
         * 正确的连接到后端服务器
         * // 实际效果示例
        原始请求: http://localhost:3000/api/users
        请求头: Origin: http://localhost:3000

        经过代理后: http://backend-server:8080/api/users  
        请求头: Origin: http://backend-server:8080  // 被修改了！
         */
        rewrite:(path) => path.replace(/^\/api/,'')///api替换成空
      }
    }
  }

})
