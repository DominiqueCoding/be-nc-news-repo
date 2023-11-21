const db = require("../db/connection")

exports.selectArticleById = (id) =>{
    return db.query(`
        SELECT * FROM articles where article_id = $1
    `,[id])
    .then(({rows}) =>{
        return rows[0]
    })
}