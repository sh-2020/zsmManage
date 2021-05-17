//用户注册登录模块数据处理
const query = require("../lib/connect")
methods = {
    //登录验证
    userLoginModel(data){ 
        return new Promise(( resolve, reject )=>{
            let sql = `SELECT user_info.avatarUrl,user_info.gender,zsm_manage_user.username,zsm_manage_user.user_id,zsm_manage_user.nick_name,zsm_manage_user.phone,zsm_manage_user.is_admin,user_info.address,user_info.province,user_info.city FROM zsm_manage_user,user_info WHERE zsm_manage_user.user_id='${data}' AND user_info.user_id='${data}'`;
            query(sql).then((result)=>{
                resolve(result) 
            }).catch((err)=>{
                reject(err)
                throw new Error("错误"+err)
            })
        })
    },
    /**
     * 微信登录用户信息录入
     * @param {*} data 
     * @returns 
     */
    userWxSin(data){
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO zsm_manage_user (user_id,phone,nick_name,is_admin) VALUE ("${data.user_id}","${data.phone}","${data.nickName}",0)`;
            query(sql).then(result=>{
                if(result.affectedRows == 1){
                    resolve(result);
                }
            }).catch(err=>{
                reject(err)
                throw new Error("错误"+err)
            })
        })
    },
    /**
     * 用户注册
     * @param {*} data 
     * @returns 
     */
    userRegister(data){
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO zsm_manage_user (user_id,phone,username,pwd,is_admin) VALUE ("${data.user_id}","${data.phone}","${data.username}","${data.pwd}",0)`;
            query(sql).then(res=>{
                if(res.affectedRows == 1){
                    resolve(res)
                }  
            }).catch(err=>{
                reject(err)
            })

        })
    },
    //判断账号(type:3)，电话(type:2)，openid(type:1) 是否已存在
    userExistence(str,type){
        return new Promise((resolve,reject)=>{
            var sql ="";
            switch(type){
                case 1:
                    sql = `SELECT user_id FROM zsm_manage_user WHERE user_id="${str}"`;
                    break
                case 2:
                    sql = `SELECT phone FROM zsm_manage_user WHERE phone="${str}"`;
                    break
                case 3:
                    sql = `SELECT username FROM zsm_manage_user WHERE username="${str}"`;
                    break
                case 4:
                    sql = `SELECT username,is_admin FROM zsm_manage_user WHERE user_id="${str}"`;
                    break
            }
            query(sql).then((result)=>{
                if(result){
                    resolve(result)
                }
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    //录入用户信息 type（1）为微信登录输入 type(2)为注册录入
    setUserInfo(data,type){
        console.log(data)
        return new Promise((resolve,reject)=>{
            var sql="";
            switch(type){
                case 1:
                    sql = `INSERT INTO user_info (user_id,gender,avatarUrl,province,city) VALUE ("${data.user_id}",${data.gender},"${data.avatarUrl}","${data.province}","${data.city}")`;
                    break;
                case 2:
                    sql = `INSERT INTO user_info (user_id,gender,province,city,address) VALUE ('${data.user_id}',${data.gender},'${data.province}','${data.city}','${data.address}')`;
                    break;
            }  
            query(sql).then(result=>{
                if(result.affectedRows == 1){
                    resolve(result)
                }
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //删除一条记录
    deleteOne(id,table){
        return new Promise((resolve,reject)=>{
            sql = `DELETE FROM ${table} WHERE id=${id}`;
            query(sql).then(result=>{
                resolve(result)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    //根据id查找信息
    selectUserInfoFromId(uid){
        let sql = `SELECT  username,user_id,nick_name,phone,is_admin FROM zsm_manage_user WHERE id='${uid}'`
        return new Promise(async (resolve,reject)=>{
            let selectInfo = await query(sql)
            if(selectInfo instanceof Array){
                resolve(selectInfo)
            }else{
                reject(selectInfo)
            }
        })
    },
    /**
     * 查询user_id
     * @param {*} data 
     * @returns 
     */
    getUserId(data){
        let sql = `SELECT user_id from zsm_manage_user where username='${data.username}' AND pwd=${data.pwd}`
        return new Promise(async (resolve,reject)=>{
            let result =await query(sql)
            if(result instanceof Array && result.length == 1){
                resolve({status:"yes",user_id:result[0]['user_id']})
            }
            if(result instanceof Array && result.length == 0){
                resolve({status:"no",user_id:result[0]['user_id']})
            }
            if(!result){
                reject("查询错误")
            }
        })
    },
    /**
     * 判断表中是否有指定字段
     * @param {*} table 
     * @param {*} column 
     * @returns 
     */
    judgeTable(table,column){
        return new Promise(async (resolve,reject)=>{
            let sql = `SELECT COUNT(*) sResult FROM information_schema.columns WHERE table_name='${table}' AND column_name='${column}'`;
            let judgeResult = await query(sql);
            judgeResult = JSON.stringify(judgeResult);
            judgeResult = JSON.parse(judgeResult);
            if(judgeResult[0]){
                resolve(judgeResult[0].sResult)
            }else{
                reject(judgeResult)
            }
        })
    },
    /**
     * 更新用户数据
     * @param {*} data 
     * @param {*} type 
     * @returns 
     */
    updateUserInfoOne(data,type){
        return new Promise(async (resolve,reject)=>{
            let UpdateResult
            if(data instanceof Object){    
                if(type == 1){ //如果type等于1则修改非地址信息
                    //判断所需要修改的字段所在的位置
                    let judgeResult = await this.judgeTable('user_info',data.key);
                    if(typeof judgeResult == "number"){
                        if(judgeResult == 0){
                            let USql = `UPDATE zsm_manage_user a SET a.${data.key}='${data.value}' WHERE a.user_id='${data.user_id}'`;
                            UpdateResult = await query(USql);
                        }
                        if(judgeResult == 1){
                            let USql = `UPDATE user_info a SET a.${data.key}='${data.value}' WHERE a.user_id='${data.user_id}'`;
                            UpdateResult = await query(USql);
                        }
                    }else{
                        reject({code:"no"})
                    }
                }
                if(type == 2){
                    let USql = `UPDATE user_info a SET a.province='${data.province}',a.city='${data.city}',a.address='${data.address}' WHERE a.user_id='${data.user_id}'`;
                    UpdateResult = await query(USql)
                }
                if(UpdateResult.changedRows == 1){
                    resolve({
                        code:"ok"
                    })
                }
            }
        })
    },
    /**
     * 更新头像
     * @param {object} parms 
     * @returns 
     */
    saveImageUrl(parms){
        return new Promise(async (resolve,reject)=>{
            try {
                let sql = `UPDATE user_info a SET a.avatarUrl='${parms.ImagePath}' WHERE a.user_id='${parms.user_id}'`
                let queryResult = await query(sql);
                if(queryResult.changedRows == 1){
                    resolve({
                        code:"ok"
                    })
                }
            } catch (error) {
                reject({
                    code:'no'
                })
                console.log(error)
            }
            
        })
    },
    /**
     * 查询旧id
     * @param {str} uid 
     */
    selectUsedAvatarUrl(uid){
        return new Promise(async(resolve,reject)=>{
            try {
                let sql = `SELECT avatarUrl FROM user_info WHERE user_id='${uid}'`;
                let queryResult = await query(sql);
                resolve(queryResult[0])
            } catch (error) {
                reject(error)
            }
        })
    },
    searchUserList(keyword,type){
        return new Promise(async(resolve,reject)=>{
            try {
                console.log(112)
                let sql = `SELECT A.id,A.user_id,A.phone,A.username,A.nick_name,B.gender,B.avatarUrl,B.province,B.city,B.address 
                FROM user_info AS B JOIN zsm_manage_user AS A ON A.user_id=B.user_id WHERE (username LIKE '${keyword}%' OR phone LIKE '${keyword}%' OR nick_name LIKE '${keyword}%') AND is_admin=${type==1?0:1}`;
                console.log(sql)
                let searchResult = await query(sql)
                if(Array.isArray(searchResult) && searchResult.length !=0){
                    resolve({
                        code:"ok",
                        queryResult:searchResult
                    })
                }else if(Array.isArray(searchResult) && searchResult.length ==0){
                    resolve({
                        code:'ok',
                        queryResult:0
                    })
                }else{
                    resolve({
                        code:'no'
                    })
                }
            } catch (error) {
                reject(error)
                console.log(error)
                throw new Error(error)   
            }
        })
    }
}

module.exports = methods