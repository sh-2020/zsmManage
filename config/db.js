const mysql = require("mysql")
let connection

try {
    connection=  mysql.createPool({
        host :"sunhui.vip",
        user : "zsm_manage",
        password : "zsm_manage",
        database : "zsm_manage",
        useConnectionPooling :true
    })
} catch (error) {
    throw new Error(error)
}

module.exports = connection