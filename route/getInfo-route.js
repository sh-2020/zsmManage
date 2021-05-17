//获取权限数据，商品数据，用户数据模块
const express = require('express')
const getInfo = require("../controller/getInfo")

const router = express.Router()

router
.get('/abilityInfo',(req,res)=>{
    getInfo.getAbilityLimitsInfo(req.query,res);
})
.get('/getUserList',(req,res)=>{
    getInfo.getUserInfoList(req,res);
})
.get('/getUserInfoFromID',(req,res)=>{
    getInfo.getUserInfoFromID(req,res);
})
.get('/updateItr',(req,res)=>{ 
    getInfo.updateItr(req,res);
})
.post('/ModifyPwd',(req,res)=>{
    getInfo.ModifyPwd(req,res);
})

module.exports = router