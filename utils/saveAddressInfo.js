const request = require('request');
/**
 * 获取地址
 * @param {*} req 
 * @returns 
 */
function getUserIpAddress(req){
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
    let urlquer="https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query="+ip+"&co=&resource_id=6006&t=1555898284898&ie=utf8&oe=utf8&format=json&tn=baidu"
    return new Promise((resolve,reject)=>{
        request(urlquer,(err,res,body)=>{
            if(err) return reject(err);
            resolve(JSON.parse(body))
        })
    })
}

module.exports = getUserIpAddress
