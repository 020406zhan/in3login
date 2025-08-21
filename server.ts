import express from 'express'
import path from 'path'
import { in3login } from "./playground/in3Login"

const app = express()
const port = 3000

// 解析 JSON 请求体
app.use(express.json())

// 提供静态文件服务
app.use(express.static('.'))

// 前端页面路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

// API 登录接口
app.post('/api/login', async (req, res) => {
  try {
    await in3login()
    res.json({ success: true, message: '登录成功' })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '登录失败' 
    })
  }
})

app.listen(port, () => {
  console.log('Listening on port: ' + port)
})