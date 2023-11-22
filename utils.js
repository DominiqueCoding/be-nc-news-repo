const db = require("./db/connection")

exports.checkIfIdExists = (id)=>{
    return db.query(`
        SELECT * FROM articles where article_id = $1
    `,[id])
    .then(({rows}) =>{
        if(!rows.length){
            Promise.reject({status:404,msg:"not found"})
        }
        return rows
    })
}