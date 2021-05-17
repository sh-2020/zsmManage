const connect = require("../config/db")
let query = function( sql, values ) {
    // 返回一个 Promise
    return new Promise(( resolve, reject ) => {
        connect.getConnection(function(err, connection) {
        if (err) {
          reject( err )
          throw new Error("数据库链接出错啦"+err)
        } else {
            // console.log("success")
            connection.query(sql, values, ( err, rows) => {
            if ( err ) {
              reject( err )
              throw new Error("数据库操作出错啦"+err)
            } else {
              resolve( rows )
            }
            // 结束会话
            connection.release()
          })
        }
      })
    })
  }
  
  module.exports =  query