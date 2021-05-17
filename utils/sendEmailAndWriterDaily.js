
const nodemailer = require("nodemailer");
const fs = require('fs')
const { resolve } = require('path')

// 定义邮件服务器服
var transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    service: 'qq',
    secure: true,
    // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
    auth: {
        user: 'nodeserver@qq.com',
        pass: 'grirjnyahflmdbej'
    }
})

function sendEmail(data){

    var sendHtml = `<div>${data}</div>`;

    var mailOptions = {
        // 发送邮件的地址
        from: 'nodeserver@qq.com', 
        // 接收邮件的地址
        to: '2191523412@qq.com',  // 
        // 邮件主题
        subject: 'You have a Error',
        // 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
        html: sendHtml
    };
    // 发送邮件，并有回调函数
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
    // res.status(200).json({message: req.body.firstname});
}

function writeDaily(data){
    fs.appendFile("./daily.txt",data+"   "+new Date()+"\n",err=>{
        if (err) {
            sendEmail(err.message)
            return console.log('写入文件失败：' + err.message)
        }
        console.log("writer success")
    })
}

module.exports.writeDaily = writeDaily

module.exports.sendEmail = sendEmail

