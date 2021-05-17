const request = require('request');

function getWxLogin(code){
    return new Promise((resolve,reject)=>{
        request(`https://api.weixin.qq.com/sns/jscode2session?appid=wx3d101bdd108a82ec&secret=203729dec184fc3f7188a17c2d4cb84c&js_code=${code}&grant_type=authorization_code`,(err,res,body)=>{
            if(err) return reject(err);
            resolve(JSON.parse(body))
        })
    })
    
}

module.exports = getWxLogin