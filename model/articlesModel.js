const db = require("../db/connection")

exports.selectArticleById = (id) =>{
    
    return db.query(`
        SELECT * FROM articles where article_id = $1
    `,[id])
    .then(({rows}) =>{
        
        if(rows.length === 0){
            return Promise.reject({code:404,msg:"not found"})
        }else{
            return rows[0]
        }
    })
}