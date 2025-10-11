<template>
   <el-row class="home" :gutter="20"><!--gutter是行间距-->
      <el-col :span="8" style="margin-top:0px"><!--span是列宽度，一列为24份，8的意思是最多放三列-->
        <el-card showdow="hover">
            <div class="user">
               <img :src="getImgUrl('user')" class="user"></img>
               <div class="user-info">
                <p class="user-name">Admin</p>
                <p class="permission">超级管理员</p>
               </div>
            </div>
            <div class="login-info">
                <p>上次登录时间:<span>{{ nowAdays }}</span></p>
                <p>上次登录地点:<span>广州</span></p>
            </div>
        </el-card >
        <!-- 数据表 -->
        <el-card showdow="hover" class="user-table">
            <!-- 在table上加一个height就可以实现固定表头，也就是表中的数据过长时，可以滚动 -->
            <el-table :data="tableData"height="350">
                <!--  -->
             <el-table-column
             v-for="(value,key) in tableLabel"
             :key="key"
             :prop="key"
             :label="value"
             >
             </el-table-column>
            </el-table>
        </el-card>
      </el-col>

    <el-col :span="16" style="margin-top:0px;padding:0 10px;">
      <div class="orders">
        <el-card
      :body-style="{display:'flex',padding:0}"
      v-for="item in countData"
      :key="item.name"
      >
      <component :is="item.icon" class="icons" 
      :style="{background:item.color}"></component>
      <div class="detail">
        <p class="num">￥{{ item.value }}</p>
        <p class="txt">{{ item.name }}</p>
      </div>
    </el-card>
      </div>

      <!-- 数据图表 -->
      <el-card class="top-echart">
        <div ref="echart" style="height:250px;"></div>
      </el-card>

      <!-- 柱状图，饼图 -->
      <div class="graph">
        <el-card>
          <div ref="userEchart" style="height:200px"></div>
        </el-card>
        <el-card>
          <div ref="videoEchart" style="height:200px"></div>
        </el-card>
      </div>
    </el-col>
   </el-row>

</template>

<script setup>
import { ref,getCurrentInstance,onMounted,reactive } from 'vue'
// import axios from 'axios'
//引入echarts
import * as echarts from 'echarts'

const Time = new Date();
const day = Time.getDate();
const Month = Time.getMonth()+1;
const nowAdays = `${Time.getFullYear()}-${Month}-${day}`;

 const getImgUrl = (user) => {
    return new URL(`../assets/images/${user}.png`,import.meta.url).href
 }
 const tableData = ref([]);
 const countData = ref([]);
 const chartData = ref([]);
 const observer = ref(null);

 const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
});

//这个是折线图和柱状图 两个图表共用的公共配置，用来控制卡片中的图表样式
const xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      //图例，就是图中数据的解释
      legend: {
        top:0,//位于顶部
      },
      grid: {
          left: "10%",
          top:"30px"
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
})

//饼图
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {
    top:0,
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})

//图表数据
const echart = ref(null);
const userEchart = ref(null);
const videoEchart = ref(null);
//获取动态数据
// const axios = require('axios');
// axios.get()
// .then(function(response){
//   console.log(response);
// })

//getCurrentInstance获取当前组件的实例对象
const {proxy} = getCurrentInstance();
console.log("看看getCurrentInstance返回的是什么");
console.log(getCurrentInstance());

const getTableData = async () => {
  const data = await proxy.$api.getTableData();
  //console.log(data);查看有没有拿到数据
  tableData.value = data.tableData;
}

const getCountData = async () => {
  const data = await proxy.$api.getCountData();
  //console.log(data)
  countData.value = data;
}

// ✅ 声明全局图表实例变量（关键！）
let oneEchart = null; 
let twoEchart = null;
let threeEchart = null;

const getChartData = async () => {
  const {orderData,userData,videoData} = await proxy.$api.getChartData();
  
  //检查echart.value是否存在，确保html已经加载出来了
  if(!echart.value){
    console.error("echart DOM 元素未找到");
    return;
  }
  //对第一个图的x轴和series进行赋值
  xOptions.xAxis.data = orderData.date;//x轴底下的刻度文字
  xOptions.series = Object.keys(orderData.data[0]).map(val=>{
     return {
          name:val,
          data:orderData.data.map(item => item[val]),
          type:'line',//图表样式
     }
  }); //用map循环来分别定义图表的数据内容和展示方式
  oneEchart = echarts.init(echart.value)//获取该ref的dom
  oneEchart.setOption(xOptions);//设置配置项

  //对第二个图表进行渲染，柱状图
  xOptions.xAxis.data = userData.map(item => item.date);
  xOptions.series = [
    {
      name:'新增用户',
      data:userData.map(item => item.new),
      type:'bar',
    },
    {
      name:'活跃用户',
      data:userData.map(item => item.active),
      type:'bar',
    },
  ]

  twoEchart = echarts.init(userEchart.value);
  twoEchart.setOption(xOptions);

  //第三个
  pieOptions.series = [
    {
      data:videoData,
      type:'pie',
    }
  ]
  threeEchart = echarts.init(videoEchart.value);
  threeEchart.setOption(pieOptions);

  //监听页面的变化
  //如果监听的容器大小发生变化，会执行会调函数
  // ✅ 创建 ResizeObserver 监听所有图表容器
  observer.value = new ResizeObserver((entries) => {
    // 无论哪个容器变化，都触发所有图表 resize
    if (oneEchart) oneEchart.resize();
    if (twoEchart) twoEchart.resize();
    if (threeEchart) threeEchart.resize();
  });

  // ✅ 监听所有图表容器（而不仅仅是第一个）
  if (echart.value) observer.value.observe(echart.value);
  if (userEchart.value) observer.value.observe(userEchart.value); // 第二个图表容器
  if (videoEchart.value) observer.value.observe(videoEchart.value); // 第三个图表容器
}


onMounted(()=>{
  getTableData();
  getCountData();
  getChartData();
})
//调用接口数据的一般方法（未封装）
// axios({
//   url:'/api/home/getTableData',
//   method:'get',
// }).then(res=>{
//   console.log(res.data);
//   //用mock.js制造假数据

//   //如果成功获取到数据就用tableData来渲染
//   if(res.data.code === 200){
//     console.log(res.data.data.tableData);
//     tableData.value = res.data.data.tableData;
//   }
// })
</script>


<style lang="less" scoped>
   .el-card{
    width:400px;
    height:200px;
   }
   .home{
    height:100%;
    padding:0 10px;
    overflow:hidden;
    .user{
        display:flex;
        align-items: center;
        border-bottom:1px solid #ccc;
        margin-bottom:10px;
        img{
            width:100px;
            height:100px;
            border-radius: 50%;
            margin-right:40px;
        }
        .user-info{
            line-height:10px;
            .user-name{
               font-size:30px;
            }
            .permission{
                color:#999;
                font-size:small;
            }
        }
    }
   }
   .login-info{
    p{
        line-height:10px;
        font-size:14px;
        color:#999;
        span{
            margin-left:60px
        }
    }

   }
    .user-table{
     margin-top:20px;
     min-height:100%;
    }
    .orders{
      display:flex;
      flex-wrap:wrap;//超出范围自动换行
      justify-content:space-between;
      margin-left:15px;
      width:100%;
      .el-card{
        width:32%;
        height:60px;
        margin-bottom:10px;
      }
      .icons{
        width:60px;
        height:60px;
        font-size:30px;
        text-align:center;
        line-height:80px;
        color:#fff;
      }
      .detail{
        margin-left:16px;
        display:flex;
        flex-direction:column;//垂直布局
        justify-content: center;
        .num{
          font-size:20px;
          margin-bottom:0px;
          margin-top:5px;
        }
        .txt{
          font-size:10px;
          text-align:center;
          color:#999;
        }
      }
    }
    .top-echart{
    width: 100%; /* 自适应父容器宽度 */
    height: 220px; /* 适当增加高度，避免内容压缩（原 220px 可能不足） */
    margin-top: 0px;
    margin-left: 15px; 
    padding: 0 10px; /* 若需要左侧间距，用 padding 替代 margin */
    box-sizing: border-box; /* ✅ 确保 padding 不影响总宽度 */
}
    .graph{
      width:100%;
      margin-top: 10px;
      margin-left: 15px;
      display: flex;
      justify-content: space-between;
      .el-card{
        width:49%;
        height:200px;
      }
    }
    
</style>