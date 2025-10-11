/**
 * 整个项目的api统一管理
 */
import request from "./request"

//请求首页左侧的表格的数据
export default {
    getTableData() {
        return request({
            //文档有点问题，要用getTable，感觉是课程设计的问题
            url:"/home/getTableData",
            method:"get",
            //mock:true,//对某个接口单独进行Mock的控制
        });
    },
    getCountData() {
        return request({
            url:"/home/getCountData",
            method:"get",
           // mock:true,//对某个接口单独进行Mock的控制
        });
    },
    getChartData() {
        return request({
            url:"/home/getChartData",
            method:"get",
        });
    },
    getUserData(params) {
        return request({
            url:"/user/getUserData",
            method:"get",
            mock:false,
            params,
        });
    },
    deleteUser(params) {
        return request({
            url:"/user/deleteUser",
            method:"get",
            mock:false,
            params,
        });
    },
    addUser(data) {
        return request({
            url:"/user/addUser",
            method:"post",
            data,
        });
    },
    editUser(data) {
        return request({
            url:"/user/editUser",
            method:"post",
            data,
        });
    },
    getMenu(params) {
        return request({
            url:"/permission/getMenu",
            method: 'post',
            data:params
        })
    }
}