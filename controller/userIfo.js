
const userIfoModel = require("../model/userIfoModel")
const createToken = require('../utils/createToken')
const wxLogin = require('../utils/wxLogin')
const uuid = require('node-uuid')
const getAddress = require('../utils/saveAddressInfo')
const fs = require('fs')
const Fs = require('../utils/myreadFile')
const path = require('path')
const  methods =  {
    async userLogin(data,res){
        let user_idResult = await userIfoModel.getUserId(data);
        if(user_idResult.status == "no"){
            res.status(204);
            return
        }
        let result = await userIfoModel.userLoginModel(user_idResult.user_id);
        if(result[0].nick_name == "" || result[0].nick_name == null){
            result[0].nick_name = '设置昵称'
        }
        if(result instanceof Array && result.length == 0){
            res.status(204).end()
        }
        if(result instanceof Array && result.length != 0){
            result = JSON.stringify(result);
            result = JSON.parse(result)
            const token =createToken(result[0])
            res.json({
                //xhr.status:获取当前服务器的响应状态  200=>成功
                status:"ok",
                data:{value:result},
                token:token
            })
        }
    },
    async userWLogin(code,res){
        let result = await wxLogin(code); //获取openid 和session_key
        if(result['session_key'] && result['openid']){
            let flag = 0; 
            const token = createToken(result); //根据openid创建token
            let searchResult = await userIfoModel.userExistence(result['openid'],1) //判断openid在数据库中是否已经存在 
            searchResult = JSON.stringify(searchResult);
            searchResult = JSON.parse(searchResult);
            
            if(searchResult instanceof Array && !searchResult.length == 0){  //如果已经存在则表示存在
                flag = 1;
            }
            //获取用户账号信息
            let userResult = await userIfoModel.userLoginModel(result['openid']);
            if(userResult instanceof Array && userResult.length ==0){
                userResult[0].username ="设置账号";
                userResult[0].is_admin = 0;
            }
            if(userResult.length == 1 && userResult[0].username == null){
                userResult[0].username = "设置账号";
            }
            res.json({
                status:"ok",
                token:token,
                openid:result.openid,
                flag:flag,
                userAdmin:userResult[0]
            })
        }
    },
    //微信登录信息录入
    async userWSin(data,res){
        let result = await userIfoModel.userWxSin(data); 
        let OtherResult = await userIfoModel.setUserInfo(data,1);
        if(result.affectedRows == 1 && OtherResult.affectedRows == 1){  //如果两条插入都执行成功则返回成功
            res.json({
                status:"ok"
            })
        }
        if(result.affectedRows == 1 && OtherResult.affectedRows != 1){  // 如果执行成功一条则删除成功的一条，放回不成功
            let deleteR = await userIfoModel.deleteOne(OtherResult.insertId,zsm_manage_user); 
            if(deleteR){
                res.json({
                    status:"err"
                })
            }
        }
        if(result.affectedRows != 1 && OtherResult.affectedRows == 1){
            let deleteR = await userIfoModel.deleteOne(result.insertId,user_info);
            if(deleteR){
                res.json({
                    status:"err"
                })
            }
        }
    },
    //判断手机号码 ,账号，是否已存在
    async checkUserInfo(str,res,type){
        let checkPhoneResult = await userIfoModel.userExistence(str,type);
        checkPhoneResult = JSON.stringify(checkPhoneResult);
        checkPhoneResult = JSON.parse(checkPhoneResult);
        if(checkPhoneResult instanceof Array && checkPhoneResult.length ==0){  //如果搜索结果是数组且长度等于0则返回true 否则 false
            res.json({                        
                status:"ok",
                data:{value:true}
            })
        }
        if(checkPhoneResult instanceof Array && checkPhoneResult.length !=0){
            res.json({
                status:"no",
                data:{value:false}
            })
        }
    },
    /**
     * 录入信息
     * @param {*} req 
     * @param {*} res 
     */
    async userRegister(req,res){
        let insertData = {}
        //获取地址定位
        let addressResult =await getAddress(req);
        if(!addressResult.data.length == 0){
            let Sreg = /.+?(省)/g
            let SHIreg = /.+?(市|自治区|自治州|县|区)/g
            insertData.address = addressResult[0].data.location
            insertData['province'] = addressResult[0].data.location.match(Sreg)[0];
            if(addressResult[0].data.location.match(SHIreg).length <= 1){
                insertData['city'] = addressResult[0].data.location.match(SHIreg)[0];
            }else{ 
                insertData['city'] = "";
                let addressStr = ""
                addressResult[0].data.location.match(SHIreg).forEach((value)=>{
                    addressResult = addressResult+"value"
                })
                insertData['address'] = addressStr
            }
            
        }else{
            insertData['province'] = "无"
            insertData['city']= "无"
            insertData['address'] ="无"
        }
        //生产user_id
        let user_id = uuid.v1();
        req.body['user_id'] = user_id;
        insertData['user_id'] = user_id;
        insertData['gender'] = 0;
        let registerResult = await userIfoModel.userRegister(req.body);
        let insertUserInfo = await userIfoModel.setUserInfo(insertData,2);
        let loginResult = await userIfoModel.userLoginModel(insertData.user_id);
        loginResult = JSON.stringify(loginResult)
        loginResult = JSON.parse(loginResult)
        const token = createToken(loginResult[0])
        if(registerResult.affectedRows == 1 && insertUserInfo.affectedRows == 1){  //如果两条插入都执行成功则返回成功
            res.status(201)
            res.json({
                status:"ok",
                id:registerResult.insertId,
                data:{value:loginResult},
                token:token

            })
        }
        if(registerResult.affectedRows == 1 && insertUserInfo.affectedRows != 1){  // 如果执行成功一条则删除成功的一条，放回不成功
            let deleteR = await userIfoModel.deleteOne(user_id,zsm_manage_user); 
            if(deleteR){
                res.json({
                    status:"err"
                })
            }
        }
        if(registerResult.affectedRows != 1 && insertUserInfo.affectedRows == 1){
            let deleteR = await userIfoModel.deleteOne(user_id,user_info);
            if(deleteR){
                res.json({
                    status:"err"
                })
            }
        }
    },
    /**
     * 修改数据
     * @param {*} data 
     * @param {*} res 
     */
    async updateUserInfo(data,res){
        try {
                let updateResult = null;
            let keyArray = Object.keys(data);
            if(keyArray.length == 2){
                updateResult = await userIfoModel.updateUserInfoOne({key:keyArray[0],value:data[keyArray[0]],user_id:data.user_id},1)
            }
            if(keyArray.length == 4){
                updateResult = await userIfoModel.updateUserInfoOne(data,2)
            }
            if(updateResult.code == 'ok'){
                res.json({
                    status:"ok"
                })
            }
            if(updateResult.code == 'no'){
                res.json({
                    status:'no'
                })
            }
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    },
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async setUserImage(req,res){
        try {
            user_id = req.user.openid || req.user.user_id;
            let reg = /([^<>/\\\|:""\*\?]+)$/;
            //删除旧头像
                //根据user_id查询旧头像
            let usedImagePath = await userIfoModel.selectUsedAvatarUrl(user_id);
            usedImagePath = path.resolve(__dirname,`../public/upload/${usedImagePath.avatarUrl.match(reg)[0]}`);
            let accessResult = await Fs.access(usedImagePath,fs.constants.F_OK);
            if(accessResult.code == 'ok'){
                let UnlinkResult = await Fs.unlink(usedImagePath);
                if(UnlinkResult.code == 'no'){
                    res.json({
                        status:'no'
                    })
                    return;
                }
            }
            //加后缀
            let mimeReg = /[^\.]\w*$/;
            let mimeType = req.files[0].mimetype.match(mimeReg)[0].slice(1);
            let oldname = req.files[0].path;
            let newname = req.files[0].path + "."+mimeType ;//
            fs.renameSync(oldname, newname);
            //提取路径
            let RegRes = req.files[0].path.match(reg)[0];
            let ImagePath = `http://sunhui.vip:8888/static/upload/${RegRes}.${mimeType}`;
            let SaveResult = await userIfoModel.saveImageUrl({ImagePath,user_id});
            res.json({
                status:SaveResult.code
            })
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
        
    },
    /**
     * 添加账号
     * @param {*} req 
     * @param {*} res 
     */
    async addOther(req,res){
        try {
            const AddOther = req.query
            //根据type确定添加的账号类型
            if(AddOther.type == 'user'){
                AddOther['is_admin'] = 0
            }
            if(AddOther.type == 'staff'){
                AddOther[is_admin] = 1
            }
            //生成user_id
            let user_id = uuid.v1();
            //设置初始数据
            AddOther['user_id'] = user_id;
            AddOther['pwd'] = '888888';
            AddOther['nick_name'] = '游客';
            AddOther['gender'] = 0;
            AddOther['avatarUrl'] = 'http://127.0.01:8888/static/upload/b6bd9209eb3992fb72081f71fe6cf048.jpeg';
            AddOther['province'] = '';
            AddOther['city'] = '';
            AddOther['address'] = '';
            //保存基本用户信息
            let registerResult = await userIfoModel.userRegister(AddOther);
            //保存用户信息
            let insertUserInfo = await userIfoModel.setUserInfo(AddOther,1);
            //根据添加的user_id查找信息
            let loginResult = await userIfoModel.userLoginModel(AddOther.user_id);
            loginResult = JSON.stringify(loginResult)
            loginResult = JSON.parse(loginResult)
            if(registerResult.affectedRows == 1 && insertUserInfo.affectedRows == 1){  //如果两条插入都执行成功则返回成功
                res.status(200)
                res.json({
                    status:"ok",
                    id:registerResult.insertId,
                    data:{value:loginResult},

                })
            }
            if(registerResult.affectedRows == 1 && insertUserInfo.affectedRows != 1){  // 如果执行成功一条则删除成功的一条，放回不成功
                let deleteR = await userIfoModel.deleteOne(user_id,zsm_manage_user); 
                if(deleteR){
                    res.json({
                        status:"err"
                    })
                }
            }
            if(registerResult.affectedRows != 1 && insertUserInfo.affectedRows == 1){
                let deleteR = await userIfoModel.deleteOne(user_id,user_info);
                if(deleteR){
                    res.json({
                        status:"err"
                    })
                }
            }
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    },
    async searchList(req,res){
        try {
            if(req.query.type == 'user'){
                let ShResult = await userIfoModel.searchUserList(req.query.keyWord,1);
                if(ShResult.code == 'ok' && Array.isArray(ShResult.queryResult) && ShResult.queryResult != 0){
                    res.json({
                        status:"ok",
                        data:ShResult.queryResult
                    })
                }else if(ShResult.code == 'ok' && ShResult.queryResult == 0){
                    res.json({
                        status:"half"
                    })
                }else {
                    res.json({
                        status:"no"
                    })
                }
            }
        } catch (error) {
            res.json({
                status:"no"
            })
            console.log(error);
            throw new Error(error)
        }
        
    }
}

module.exports= methods;
