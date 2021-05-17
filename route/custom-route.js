const express = require('express')

const jwt = require('jsonwebtoken')

const router = express.Router()

router
.get('/index',(req,res)=>{
    console.log(req.user)
    res.send('1111')
})  
.post('/index',(req,res)=>{
    console.log(req.body)
    res.send('1111')
    throw new Error('测试')
})


module.exports = router