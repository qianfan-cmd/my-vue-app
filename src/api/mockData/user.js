import Mock from 'mockjs'

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}



let List = []
const count = 200
//模拟200条用户数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      addr: Mock.mock('@county(true)'),
      'age|18-60': 1,
      birth: Mock.Random.date(),
      sex: Mock.Random.integer(0, 1)
    })
  )
}


export default {
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserList: config => {
    console.log('=== Mock 服务调用开始 ===')
    console.log('接收到的完整URL:', config.url)
    
    // 解析查询参数
    const queryString = config.url.split('?')[1] || ''
    console.log('查询字符串:', queryString)
    
    // 解析参数
    const params = {}
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=')
        params[key] = decodeURIComponent(value)
      })
    }
    
    console.log('解析出的参数:', params)
    
    // 处理参数
    const name = params.name || ''
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    
    console.log('最终使用的参数:', { name, page, limit })
    
    // 筛选逻辑
    const mockList = List.filter(user => {
      if (name && user.name.indexOf(name) === -1) return false
      return true
    })
    
    console.log('总数据量:', List.length)
    console.log('筛选后数据量:', mockList.length)
    
    // 分页逻辑
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const pageList = mockList.slice(startIndex, endIndex)
    
    console.log(`分页范围: ${startIndex}-${endIndex}`)
    console.log('分页数据量:', pageList.length)
    console.log('=== Mock 服务调用结束 ===')
    
    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length,
        page: page,
        limit: limit
      }
    }
  },
  /**
   * 删除用户
   * @param id
   * @return {*}
   */
  deleteUser: config => {
    const { id } = param2Obj(config.url);

    if(!id){
      return {
        code: -999,
        message: "参数不正确"
      }
    }else{
      List = List.filter(u => u.id != id);
      return {
        code:200,
        message:"删除成功"
      }
    }
  },
  /**
   * 增加用户
   * @param name, addr,age,birth,sex
   * @return {{code: number, data: {message: string}}}
   */
  createUser: config => {
    const {name,addr,age,birth,sex} = JSON.parse(config.body);
    List.unshift({
      id: Mock.Random.guid(),
      name:name,
      age:age,
      addr:addr,
      birth:birth,
      sex:sex,
    });
    return {
      code:200,
      data: {
        message:"添加成功"
      },
    };
  },
    /**
   * 编辑用户
   * @param name, addr,age,birth,sex
   * @return {{code: number, data: {message: string}}}
   */
  updateUser : config => {
  const {id,name,addr,age,birth,sex} = JSON.parse(config.body);
  //数组.some(函数)的意思是对数组中的每个元素都执行这个函数，如果函数对任意一个元素返回true则some立刻返回true
  //然后停止遍历执行
  List.some((user)=>{
    if(user.id === id){
      user.name = name;
      user.addr = addr;
      user.age = age;
      user.birth = birth;
      user.sex = sex;
      return true;
    }
  });
  return {
    code: 200,
    data: {
      message: "编辑成功"
    }
  }
  },
}