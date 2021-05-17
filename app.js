'use strict'
const express = require('express')
const expressJwt = require('express-jwt');
const path = require('path')
const cRoute = require('./route/custom-route')
const errHandel = require('./utils/checkError')
const CASRoute = require('./route/createrUserAndSin')
const GETInfo = require('./route/getInfo-route')
const multer = require('multer')
const cors = require('cors')
// 创建服务器
const  App = express()

// 配置请求
App.use(cors())

//配置静态资源
App.use(express.static('/node_modules')) //配置node模块

.use('/static',express.static('public')) //配置公共文件夹路径

//配置token验证
.use(expressJwt({
  secret:"zsm12345",
  algorithms:['HS256']
}).unless({
path:['/login','/register','/wx_login','/checkUserInfo',/^\/static\/.*/]
})) 

//设置上传文件路径
const uploadPath = multer({
  dest:'./public/upload'
})
App.use(uploadPath.any())
//请求配置
App.use(express.json())
App.use(express.urlencoded({ extended: false }))

.all('*',function (req, res, next) {
    console.log('收到请求')
    if (req.method == 'OPTIONS') {
      res.send(200); /让options请求快速返回/
    }
    else{
      next();
    }
  })
//挂载路由
.use(CASRoute)
.use(cRoute) 
.use(GETInfo)
//错误处理
.use(errHandel)
//空路由
.use(function(req,res){
  res.status=404
})
.listen(8888,()=>{
    console.log('running...')
})
