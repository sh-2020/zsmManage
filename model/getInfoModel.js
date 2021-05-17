const query = require("../lib/connect")

const methods = {
    /**
     * 获取权限列表
     * @param {*} role_id 
     * @returns 
     */
    getAbilityLimitsInfoModel(role_id){
        return new Promise(async (resolve,reject)=>{
            let sql = `SELECT * FROM zsm_manage_role WHERE role_id='${role_id}'`
            try {
                let queryResult = await query(sql);
                if(queryResult instanceof Array && queryResult.length == 1){
                    resolve(queryResult)
                }else{
                    reject(queryResult)
                }
            } catch (error) {
                throw new Error(error)
            }
        })
    },
    /**
     * 获取对应功能名称
     * @param {*} limit_id 
     * @returns 
     */
    getLimitsInfo(limit_id){
        return new Promise(async (resolve,reject)=>{
            let sql = `SELECT limit_id,id,name,icon FROM zsm_manage_limitInfo WHERE limit_id='${limit_id}'`
            try {
                let queryResult = await query(sql);
                if(queryResult instanceof Array && queryResult.length == 1){
                    resolve(queryResult)
                }else{
                    reject(queryResult)
                }
            } catch (error) {
                throw new Error(error)
            }
        })
    },
    /**
     * 查找用户信息列表
     * @param {num} id 起始位置
     * @returns 
     */
    getUserInfoListModel(data){
        return new Promise(async (resolve,reject)=>{
            let sql = `SELECT A.id,A.user_id,A.phone,A.username,A.nick_name,B.gender,B.avatarUrl,B.province,B.city,B.address 
            FROM user_info AS B JOIN zsm_manage_user AS A ON A.user_id=B.user_id WHERE A.is_admin=0 AND A.id${data.type == 'true'?'>':'<'}${data.id} ORDER BY A.first_login_time ${data.type == 'true'?'':'DESC'} LIMIT 5 `
            console.log(sql)
            try {
                let queryResult = await query(sql)
                if(Array.isArray(queryResult) && queryResult.length !=0){
                    resolve({
                        code:"ok",
                        queryResult:queryResult
                    })
                }else if(Array.isArray(queryResult) && queryResult.length ==0){
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
                throw new Error(error)
            }
        })
    },

    /**
     * 根据id获取用户数据
     */
    getUseriInfo(id){
        return new Promise(async (resolve,reject)=>{
            let sql = `SELECT A.user_id,MD5(A.pwd) AS pwd,B.gender,B.avatarUrl,B.province,B.city,B.address,B.introduction,B.bir,A.phone,A.username,A.nick_name,A.first_login_time,A.is_admin 
            FROM zsm_manage_user AS A JOIN user_info AS B ON A.user_id=B.user_id WHERE A.id=${id}`
            try {
                let Selectresult = await query(sql);
                if(Array.isArray(Selectresult) && Selectresult.length == 1){
                    console.log(sql)
                    resolve({code:1,data:Selectresult[0]});
                }
                if(Array.isArray(Selectresult) && Selectresult.length == 0){
                    resolve({code:0,data:'id 为 0的用户未找到！'});
                }
            } catch (error) {
                reject(error);
                throw new Error(error);
            }
        })
    },
    /**
     * 判断user是否存在
     */
     judgeUser(uid){
        return new Promise(async (resolve,reject)=>{
            let sql = `SELECT user_id FROM user_info WHERE user_id='${uid}'`;
            try {
                let judgeRes = await query(sql);
                if(!Array.isArray(judgeRes) || !judgeRes.length == 1){
                    resolve({code:0,msg:'一个不存在的用户！'});
                }else{
                    resolve({code:1});
                }
            } catch (error) {
                reject({code:-1,msg:'服务器错误'})
                console.log(error)
            }
        })
    },
    /**
     * 根据user_id更新简介
     * param（obj） 中有user_id 和 需要更改的简介内容
     */
    updateItr(param){
        return new Promise(async(resolve,reject)=>{
            try {
                let judgeRes = await this.judgeUser(param.user_id);
                if(judgeRes.code == 0){
                    resolve({code:0,msg:judgeRes.msg})
                    return;
                }
                let sql = `UPDATE user_info SET user_info.introduction='${param.introduction}' WHERE user_id = '${param.user_id}'`;
                let changeResult = await query(sql);
                if(changeResult.affectedRows == 1){
                    resolve({code:1,msg:'修改成功！'});
                } 
            } catch (error) {
                reject({code:-1,msg:'服务器错误！'})
                console.error(error)
                throw new Error(error)
            }
        })
    },
    ModifyPwd(param){
        return new Promise(async (resolve,reject)=>{
            try {
                console.log(param);
                let sql = `UPDATE zsm_manage_user SET zsm_manage_user.pwd='${param.pwd}' WHERE id =${param.id}`;
                let ModifyRes = await query(sql);
                console.log(ModifyRes);
                if(ModifyRes.affectedRows == 1){
                    resolve({code:1,msg:'修改成功！'});
                }
            } catch (error) {
                reject({code:0,msg:'服务器错误'})
                console.log(error)
            }
        })
    }
}

module.exports = methods
