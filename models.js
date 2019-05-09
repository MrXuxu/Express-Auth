// 引入 mongoose 
const mongoose = require('mongoose')

// 连接数据库，自动新建 ExpressAuth 库
mongoose.connect('mongodb://localhost:27017/ExpressAuth', {
  useNewUrlParser: true,
  useCreateIndex: true
})

// 建立用户表
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    // 设置 bcrypt 加密
    set(val) {
      return require('bcrypt').hashSync(val, 10)
    }
  }
})

// 建立用户数据库模型
const User = mongoose.model('User', UserSchema)

module.exports = { User }