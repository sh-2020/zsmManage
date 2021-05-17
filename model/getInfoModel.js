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
    getUseriInfo(){
        return new Promise(async (resolve,reject)=>{
            let sql = `SELECT A.user_id,MD5(A.pwd) AS pwd,B.gender,B.avatarUrl,B.province,B.city,B.address,B.introduction,B.bir,A.phone,A.username,A.nick_name,A.first_login_time,A.is_admin 
            FROM zsm_manage_user AS A JOIN user_info AS B ON A.user_id=B.user_id WHERE A.id=0;`
            try {
                let Selectresult = await query(sql);
                console.log(sql)
                if(Array.isArray(Selectresult) && Selectresult.length == 1){
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
    }
}
module.exports = methods
