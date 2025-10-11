// request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config'

const service = axios.create({
  baseURL: config.baseApi,
})

const NET_WORKERROR = '网络错误'

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 打印完整请求信息
    console.log('请求方法:', config.method.toUpperCase())
    console.log('请求URL:', config.baseURL + config.url)
    
    // 处理 GET 请求参数
    if (config.method.toLowerCase() === 'get' && config.params) {
      const params = new URLSearchParams()
      
      // 添加有效参数
      Object.keys(config.params).forEach(key => {
        if (config.params[key] !== undefined && config.params[key] !== null) {
          params.append(key, config.params[key])
        }
      })
      
      // 构建查询字符串
      const queryString = params.toString()
      if (queryString) {
        config.url += (config.url.includes('?') ? '&' : '?') + queryString
      }
      
      console.log('完整请求URL:', config.url)
    }
    
    return config
  },
  function (error) {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (res) => {
    console.log('响应状态:', res.status)
    console.log('响应数据:', res.data)
    
    const { code, data, msg } = res.data
    
    if (code === 200) {
      return data
    } else {
      const errorMsg = msg || NET_WORKERROR
      ElMessage.error(errorMsg)
      return Promise.reject(new Error(errorMsg))
    }
  },
  (error) => {
    console.error('请求错误详情:', error)
    
    if (error.response) {
      console.error('响应状态:', error.response.status)
      console.error('响应数据:', error.response.data)
      console.error('响应头:', error.response.headers)
    } else if (error.request) {
      console.error('请求已发送但未收到响应:', error.request)
    } else {
      console.error('请求配置错误:', error.message)
    }
    
    const errorMsg = error.message || NET_WORKERROR
    ElMessage.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  }
)

// 请求函数
function request(options) {
  options.method = options.method || 'get'
  
  // 处理 GET 请求参数
  if (options.method.toLowerCase() === 'get') {
    // 将 data 转换为 params
    if (options.data) {
      options.params = options.data
      delete options.data
    }
  }
  
  // 处理 mock 开关
  let isMock = config.mock
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock
  }

  // 针对环境进行处理
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  
  console.log('请求配置:', {
    url: options.url,
    method: options.method,
    params: options.params,
    data: options.data,
    mock: isMock,
    baseURL: service.defaults.baseURL
  })
  
  return service(options)
}

export default request