const gModel = require('../model/getInfoModel') 

const methods = {
    /**
     * 获取权限所能使用的功能
     * @param {*} data 包含role_id的对象
     * @param {*} res 
     */
    async getAbilityLimitsInfo(data,res){
        let saveRole = [];
        try {
            let result = await gModel.getAbilityLimitsInfoModel(data.grade)
            for(let role of Object.keys(result[0])){
                if(role == 'id' || role =='role_id'){
                    continue
                }
                if(result[0][role] != 0){
                    let searchAbilityInfoResult = await gModel.getLimitsInfo(result[0][role]);
                    if(searchAbilityInfoResult instanceof Array && searchAbilityInfoResult.length == 1){
                        searchAbilityInfoResult = JSON.stringify(searchAbilityInfoResult);
                        searchAbilityInfoResult = JSON.parse(searchAbilityInfoResult);
                        saveRole.push(searchAbilityInfoResult[0])
                    }
                }
            }
            res.json({
                status:"ok",
                value:saveRole
            })
            
        } catch (error) {
            throw new Error(error)
        }
        
    },
    async getUserInfoList(req,res){
        let searchResult = await gModel.getUserInfoListModel(req.query);
        if(searchResult.code == 'ok' && Array.isArray(searchResult.queryResult) && searchResult.queryResult != 0){
            res.json({
                status:"ok",
                data:searchResult.queryResult
            })
        }else if(searchResult.code == 'ok' && searchResult.queryResult == 0){
            res.json({
                status:"half"
            })
        }else {
            res.json({
                status:"no"
            })
        }
    },
    async getUserInfoFromID(req,res){
        console.log(req.query)
        if(req.query.cid == ''){
            return;
        }
        try {
            let selectResult = await gModel.getUseriInfo();
            let status;
            if(selectResult.code == 0){
                status = "no"
            }
            if(selectResult.code == 1){
                status = "yes"
            }
            res.json({
                status:status,
                data:selectResult.data
            })
            
        } catch (error) {
            res.json({
                status:"err",
                data:"服务器错误"
            })
            console.log(error);
            throw new Error(error)
        }
        
    }
}

module.exports = methods
