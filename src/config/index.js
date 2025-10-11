//把不同环境的地址都存储在这里
//这里面存储的Api都是api url里通用的部分，
//例如说具体的mock内容在/home/getTableData那就在mockApi的后面加上这一段
//开发环境，测试环境，线上环境
const env = import.meta.env.MODE || "prod";//拿到现在的运行环境，默认线上
const EnvConfig = {
    development:{
        baseApi:"/api",
        mockApi:"https://mock.apifox.cn/m1/4068509-0-default/api"
    },
    test:{
        baseApi:"//test.future.com/api",
        mockApi:"https://mock.apifox.cn/m1/4068509-0-default/api"
    },    
    prod:{
        baseApi:"//future.com/api",
        mockApi:"https://mock.apifox.cn/m1/4068509-0-default/api"
    },
}

//写完后暴露对象
export default {
    env,
    ...EnvConfig[env],
    //mock，通过一个全局开关来控制所有的mock 和request配合
    mock:false,
}