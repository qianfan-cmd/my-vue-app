<script setup>
import {ref,getCurrentInstance,onMounted,reactive,nextTick} from 'vue'
import {ElMessageBox,ElMessage} from 'element-plus'

const userData = ref([]);
const handleClick = () => {
  console.log('click')
}

const tableData = ref([]);

const {proxy} = getCurrentInstance();

const getUserData = async () => {
  try {
    console.log('请求参数:', config.value);
    
    const data = await proxy.$api.getUserData(config.value);
    console.log('API 返回的数据:', data);
    
    if (data && data.list) {
      // 直接使用后端返回的数据，不进行前端分页
      tableData.value = data.list.map(item => ({
        ...item,
        sexLabel: item.sex.toString() === '1' ? '男' : '女'//把sex统一转成字符判断
      }));

      config.value.total = data.count;
      
      console.log('表格数据:', tableData.value);
    } else {
      console.error('返回的数据格式不正确:', data);
      ElMessage.error('返回的数据格式不正确');
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    ElMessage.error('获取用户数据失败');
  }
}
   


const tableLabel = ref([
    {
        prop:'name',
        label:'姓名'
    },
        {
        prop:'age',
        label:'年龄'
    },
        {
        prop:'sexLabel',
        label:'性别'
    },
        {
        prop:'birth',
        label:'出生日期',
        width:200,
    },
        {
        prop:'addr',
        label:'地址',
        width:400
    },
])

//数据仓库 获取到用户输入的查询内容
const formInline = ref({
    keyWord:'',

})
const config = ref({
    name:'',
    total:0,
    page:1,
    limit:10,
})
const handleSearch = () => {
    config.value.name = formInline.value.keyWord;
    getUserData();
}
const handleChange = (page) => {
    config.value.page = page;
    console.log("当前页码：",config.value.page);
    getUserData();
}
const handleDelete = (val) => {
  ElMessageBox.confirm(
    '你确定要删除吗？',   // 内容
    '提示',              // 标题
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,      // 内容居中（可选）
    }
  )
    .then(async () => {
      // 调用删除接口
      await proxy.$api.deleteUser({ id: val.id })

      // 删除成功提示
      ElMessage({
        showClose: true,
        message: '删除成功',
        type: 'success'
      })

      // 刷新数据
      getUserData()
    })
    .catch(() => {
      // 取消删除提示
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}
const action = ref("add");//记录用户操作，默认为添加
const dialogVisible = ref(false);//控制弹窗
const formUser = reactive({
  sex:'1',//性别默认男
});
//表单的验证规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: '地址是必填项' }]
})
const handleClose = () =>{
  //获取表单重置表单
  dialogVisible.value = false;
  //重置userForm，也就是重置弹窗的内容防止之前填写的信息遗留在弹窗中
  proxy.$refs['userForm'].resetFields();

}
const handleCancel = ()=>{
  dialogVisible.value = false;
  proxy.$refs['userForm'].resetFields();//重置userForm
}
const handleAdd = (val) => {
  dialogVisible.value = true;
  action.value = 'add';//操作标记
}
//调整日期格式
const timeFormat = (time) =>{
  var time = new Date(time);//转换为Date对象，单位为毫秒，以1970-1-1为0点
  var year = time.getFullYear();//返回四位的年份
  var month = time.getMonth()+1;//返回月份
  var date = time.getDate();//返回日期
  function add(m) {
    return m < 10 ? "0"+m : m;
  }
  return year + "-"+add(month)+'-'+add(date);
}
//提交操作 
 /**
   * 详细解释
   * formUser是表单数据容器，存储表单中填写的姓名年龄等数据（就是填写的那个表格）
   * 用reactive定义，是响应式对象，提交表单的时候就是把这个对象发送给后台
   * 
   * userForm是表单本身，作用是管理整个表单，包括验证规则重置功能等
   * 
   * val是当前行的数据
   * {
      id: 123,
      name: "张三",
      age: 25,
      sex: 1, // 可能是数字
      birth: "1998-05-20",
     addr: "北京市朝阳区"
     }

   */
const onSubmit = () => {
  //先校验
  proxy.$refs['userForm'].validate(async (vaild)=>{
    if(vaild){
      let res = null;
      //正则表达式，^代码字符串开始，d{4}匹配四个字符代表年，-匹配-，$表示匹配字符串结束
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth :
      timeFormat(formUser.birth);
      if(action.value === 'add'){
        console.log(formUser);
        res = await proxy.$api.addUser(formUser);//触发接口实现变化
      }else{
        //编辑用户
        res = await proxy.$api.editUser(formUser);
      }
      if(res){
        dialogVisible.value = false;//信息输入成功，关闭弹窗
        proxy.$refs['userForm'].resetFields();//resetFields是重置的意思
        getUserData();
      }
    }else{
       ElMessage({
        showClose: true,
        message: '请输入正确的内容',
        type: 'error'
       })

       getUserData();
    }
  })
}
const handleEdit = (val) => {
  action.value = 'edit';
  dialogVisible.value = true;
  nextTick(()=>{//没用nextTick的时候点击编辑再点击关闭后，点击新增，表单中会出现被编辑者的信息，没有被重置
      Object.assign(formUser,{...val,sex:''+val.sex});//把该行用户信息填写到表单上
  })

/**
 * 问题：编辑后新增表单残留数据
 * Object.assign 作用是把一个对象的数据复制到另一个对象上，Object.assign(目标对象，源对象)
 * let target = { a: 1 };
   let source = { b: 2 };
   Object.assign(target, source);
// 现在 target 变成 { a: 1, b: 2 }  
 * 
 {...val,{sex:''+val.sex}}后半段的作用是把sex变化成字符串形式，...val：复制val所有属性
 所以Object.assign(formUser,{...val,sex:''+val.sex});的意思是把该行用户信息填写到表单上

 nextTick-等待时机
 作用告诉vue等页码更新完再做这件事，确保表单完全创建后再复制数据
 */
}
onMounted(()=>{
    getUserData();
})
</script>

<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">+新增</el-button>
        <!--通过设置inline=true使得表单域变为行内表单 :model是elementplus特有是属性，意思是
        在javascript中绑定了一个存储着表单中所有数据的对象，是一个数据仓库-->
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input placeholder="请输入用户名" v-model.lazy="formInline.keyWord" 
                @keyup.enter="handleSearch" ></el-input><!--输入框内显示的内容-->
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="tableData" style="width: 100%">
        <!-- prop="渲染的变量名" fixed的意思是固定，没有对应上名字无法渲染。label是表头
         el-table-column是表中的一列数据 -->
    <el-table-column 
     v-for="item in tableLabel"
     :key="item.prop"
     :width="item.width ? item.width : 125"
     :label="item.label" 
     :prop="item.prop" 
    />

    <el-table-column fixed="right" label="Operations" min-width="200">
      <template #="scope">
          <!-- 在type前加link的话，按钮的样式就是蓝色的字体按钮 -->
        <el-button  type="primary" size="small" @click="handleEdit(scope.row)">
          编辑
        </el-button><!--plain是让按钮样式变透明-->
        <el-button  type="danger" size="small" plain @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination 
  class="pager"
  background 
  layout="prev, pager, next" 
  size="small"
  :total="config.total"
  @current-change = "handleChange" /><!--total是总数据量的意思-->
    </div>
    <!--dialog 是一个对话框 用dialogVisible来控制是否弹出 title显示的是表单的标题 -->
    <el-dialog 
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
       <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理
    userForm是整个表格本身通过ref属性定义在js中通过$refs访问(proxy
    里通过$refs可访问用ref定义的dom元素或组件实例)-->
    <el-form :inline="true"  :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select  v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>


<style lang="less" scoped>
.user-header{
    display:flex;
    justify-content:space-between;
}
.table{
  position:relative;
  height:520px;
  .pager{
    position:absolute;
    right:10px;
    bottom:30px;
  }
  .el-table{
    width:100%;
    height:500px;
  }
}
.select-clearn{
  display: flex;
}
</style>