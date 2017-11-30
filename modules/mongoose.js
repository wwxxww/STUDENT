// 引入mongoose模块
var mongoose = require('mongoose');
// 使用mongoose.connect()方法连接数据库，
// 连接字符串格式：mongodb://username:password@host:port/database
// mongodb:mongodb专用协议
// username:连接数据库的用户名，可省略
// password:连接数据库的用户密码，可省略
// host:数据库所在的主机域名或IP地址
// port:数据库所在的主机的端口
// database:数据库的名称
mongoose.connect('mongodb://127.0.0.1:27017/students');

// 监听数据库连接事件error,open
var db = mongoose.connection;
db.on('error', function (err) {
    console.err('数据库连接错误！Error:' + err);
});
db.once('open', function () {
    console.log('数据库已打开成功！');
});

// 定义数据模型User
// 第一个参数：数据库中的集合名称
// 第二个参数：数据库中的集合的架构（结构）
// 目的：把数据库中的集合映射成语言中的对象，
// 让使用对象的代码就如同操作数据库一样。
var User = mongoose.model('users', {
    _id: {
        // ObjectId类型，可生成唯一的GUID
        type: mongoose.Schema.Types.ObjectId,
        // defaults用来设置字段的默认值
        defaults: new mongoose.Types.ObjectId
    },
    loginname: String,
    password: String,
    status: { type: Number, defaults: 0 },
    createtime: { type: Date, defaults: Date.now() },
    createuserid: mongoose.Schema.Types.ObjectId,
    lastupdatetime: { type: Date, defaults: Date.now() },
    lastupdateuserid: mongoose.Schema.Types.ObjectId
});

// 定义数据模型Student
var Student = mongoose.model('students', {
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        defaults: new mongoose.Types.ObjectId
    },
    name: String,
    sex: String,
    age: Number,
    phone: String,
    classid: {
        type: mongoose.Schema.Types.ObjectId,
        // 外键关联，在mongodb数据库没有join连接，可在代码层级进行关联
        ref: 'classes'
    },
    status: { type: Number, defaults: 0 },
    createtime: { type: Date, defaults: Date.now() },
    createuserid: { type:mongoose.Schema.Types.ObjectId, ref:'users'},
    lastupdatetime: { type: Date, defaults: Date.now() },
    lastupdateuserid: mongoose.Schema.Types.ObjectId
});

// 定义数据模型Class
var Class = mongoose.model('classes', {
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        defaults: new mongoose.Types.ObjectId
    },
    name: String,
    description: String,
    status: { type: Number, defaults: 0 },
    createtime: { type: Date, defaults: Date.now() },
    createuserid: mongoose.Schema.Types.ObjectId,
    lastupdatetime: { type: Date, defaults: Date.now() },
    lastupdateuserid: mongoose.Schema.Types.ObjectId
});

// 导出对象，供外部使用，外部不需要的对象不必导出
// 目的：隐藏实现细节，减少命名冲突
module.exports = { mongoose, User, Student, Class };