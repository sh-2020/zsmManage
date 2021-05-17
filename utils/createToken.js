const jwt = require('jsonwebtoken')
function createToken(result){
    
    return 'Bearer '+ jwt.sign(result,'zsm12345',{algorithm:'HS256'});
}

module.exports=createToken
