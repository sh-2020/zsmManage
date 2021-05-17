//用户注册登录模块路由
const express = require('express')
const userIfo = require("../controller/userIfo")
const router = express.Router()
router
.post('/login',(req,res)=>{
    userIfo.userLogin(req.body,res)
  })
.get('/wx_login',(req,res)=>{
    userIfo.userWLogin(req.query.code,res)
})
.post('/wSinUp',(req,res)=>{
    req.body['user_id'] = req.user.openid
    userIfo.userWSin(req.body,res)
})
.post('/checkUserInfo',(req,res)=>{
    userIfo.checkUserInfo(req.body.phone,res,2)
})
.get('/checkUserInfo',(req,res)=>{
    userIfo.checkUserInfo(req.query.username,res,3)
})
.post('/register',(req,res)=>{
    userIfo.userRegister(req,res)
})
.get('/ModifValue',(req,res)=>{
    userIfo.updateUserInfo(req.query,res)
})
.post('/userInfoImage',(req,res)=>{
    userIfo.setUserImage(req,res)
})
.get('/myselfPage/addother/check',(req,res)=>{
    let type;
    if(req.query.type == 'username'){
        type = 3
    }
    if(req.query.type == 'phone'){
        type = 2
    }
    userIfo.checkUserInfo(req.query.value,res,type)
})
.get('/myselfPage/addother',(req,res)=>{
    userIfo.addOther(req,res)
})
.get('/userManage/search',(req,res)=>{
    userIfo.searchList(req,res)
})
module.exports = router
