// 引入 express
const express = require('express')
// 引入 User 表
const { User } = require('./models')
// 引入 jwt
const jwt = require('jsonwebtoken')
// 解析 token 用的密钥
const SECRET = 'token_secret'

// 创建服务器应用程序
const app = express()
app.use(express.json())

app.get('/api/user', async (req, res) => {
  res.send('hello node.js')
})

app.post('/api/register', async (req, res) => {
  // console.log(req.body);
  const isUserHas = await User.findOne({
    username: req.body.username
  })
  if (isUserHas) {
    return res.status(422).send({
      message: '用户名重复'
    })
  }
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user)
})


app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.status(422).send({
      message: '用户名不存在'
    })
  }
  // bcrypt.compareSync 解密匹配，返回 boolean 值
  const isPasswordValid = require('bcrypt').compareSync(
    req.body.password,
    user.password
  )
  if (!isPasswordValid) {
    return res.status(422).send({
      message: '密码无效'
    })
  }
  /* 
    生成 token
    jwt.sign() 接受两个参数，一个是传入的对象，一个是自定义的密钥
  */
  const token = jwt.sign({ id: String(user._id) }, SECRET)
  res.send({
    user,
    token
  })
})

app.get('/api/profile', async (req, res) => {
  const raw = String(req.headers.authorization.split(' ').pop())
  // 解密 token 获取对应的 id
  const { id } = jwt.verify(raw, SECRET)
  req.user = await User.findById(id)
  res.send(req.user) 
})

// 开启服务，监听端口
app.listen(3001, () => {
  console.log('http://localhost:3001')
})