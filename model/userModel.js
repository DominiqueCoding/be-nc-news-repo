const db = require("../db/connection")

exports.selectAllUsers = ()=>{
    const selectQuery = db.query(`
        SELECT * FROM users;
    `)
    return selectQuery
    .then(({rows})=>{
        return rows
    })
}