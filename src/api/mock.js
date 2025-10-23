import Mock from 'mockjs';
import homeApi from './mockData/home';
import userApi from './mockData/user';
import menuApi from './mockData/permission'
//mock是在浏览器层面拦截请求，vite代码是在服务器层面拦截请求，所以两者的区别是：
//mock是在浏览器层面拦截请求，可以模拟数据，可以设置延迟时间，可以设置错误信息等；
//vite是在服务器层面拦截请求，可以设置请求头，可以设置响应头，可以设置响应体等。
//拦截路径 拦截方法 制造出的假数据
//接口，方式，数据

//假如说后端要给的接口是/api/home/getTableData，但是后端还没完成
//mock的作用就是先拦截前端对这个接口的请求，拦截的方法是get，直接返回
//home.js里定义的假数据

//当前端发起 GET /api/home/getTableData 请求时，Mock.js 会自动拦截：

//必须用正则表达式
//正则表达式的意思就是使用正则表达式匹配所有以 /api/user/getUserData开头的 URL
Mock.mock(/\/api\/home\/getTableData/, 'get', homeApi.getTableData)
Mock.mock(/\/api\/home\/getCountData/, 'get', homeApi.getCountData)
Mock.mock(/\/api\/home\/getChartData/, 'get', homeApi.getChartData)
Mock.mock(/\/api\/user\/getUserData/, 'get', userApi.getUserList)
Mock.mock(/\/api\/user\/deleteUser/,'get',userApi.deleteUser)
Mock.mock(/\/api\/user\/addUser/,'post',userApi.createUser)
Mock.mock(/\/api\/user\/editUser/,'post',userApi.updateUser)
Mock.mock(/\/api\/permission\/getMenu/,'post',menuApi.getMenu)