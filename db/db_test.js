// 测试使用mongoose操作mongodb数据库
const md5 = require('blueimp-md5')
// 一、连接数据库
// 1、引入mongoose
const mongoose = require('mongoose')
// 2、连接指定数据库
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 3、获取连接对象
const conn = mongoose.connection
// 4、绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){ // 连接成功后的回调
    console.log('数据库连接成功')
})

// 二、得到对应特定集合的model,进行CRUD
// 1、定义schema(描述文档（对象）结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true}, // 用户类型： applicant/employer
    header: {type: String}
})
// 2、定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user',userSchema) // 集合的名称为：users
// 3、通过Model或其实例对集合数据进行CRUD操作
// 3.1 通过Model实例的save()添加数据
function testSave(){
    // 创建UserModel实例
    const userModel = new UserModel({username: 'Bob', password: md5('123'), type: 'applicant'})
    // 调用save()保存
    userModel.save(function(error,user){
        console.log('save()',error,user)
    })
}
// testSave() 
// 3.2 通过Model的find()/findOne()查询多个或一个数据
function testFind() {
    // 查询多个
    UserModel.find(function(error, users){
        console.log('find()查询多个', error, users)
    })
    // 查询一个
    UserModel.find({_id: '5ccfd73d54058441a01728cd'},function(error, user){
        console.log('find()查询一个', error, user)
    })
    // 查询一个
    UserModel.findOne({_id: '5ccfd73d54058441a01728cd'},function(error, user){
        console.log('findOne()查询一个', error, user)
    })
}
// testFind()
// 3.3 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5ccfd73d54058441a01728cd'},{username: 'Tom22'},
        function(error,oldUser){
            console.log('findByIdAndUpdate()',error,oldUser)
        }
    )
}
// testUpdate()
// 3.4 通过Model的remove() 删除匹配的数据
function testDelete() {
    UserModel.remove({_id: '5ccfd73d54058441a01728cd'},function(error,doc){
        console.log('remove()',error,doc)
    })
}
testDelete()

