
const fs = require('fs')
const { resolve } = require('path')

module.exports.readFile = function(path){
    return new Promise((resolve,reject)=>{
        fs.readFile(path,'utf-8',function (err, data) {
            if (err) {
                reject(err)
                throw new Error('读取文件失败：' + err.message)
            }else{
                resolve(data)
            }
        })
    })
}

module.exports.writeFile = function(path,data){
    return new Promise((resolve,reject)=>{
        fs.writeFile(path,data,function(err){
            if (err) {
                reject(err)
                throw new Error('写入文件失败：' + err.message)
            }else{
                resolve({
                    code:"ok"
                })
            }
        })
    })
}

module.exports.access = function(path,mode){
    return new Promise((resolve,reject)=>{
        try {
            fs.access(path,mode,(err)=>{
                if(err){
                    console.log(err)
                    resolve({code:'no'})
                }
                else{
                    resolve({code:'ok'})
                }
            })
        } catch (error) {
            reject(error)
        }
        
    })
}

module.exports.unlink = function(path){
    return new Promise((resolve,reject)=>{
        try {
            fs.unlink(path,(err,data)=>{
                if (err) {
                    console.log(err)
                    resolve({code:'no'})
                } else{
                    console.log('删除文件成功');
                    resolve({code:'ok'})
                }
            })
        } catch (error) {
            reject(error)
            console.log(error)
        }
        
    })
}

