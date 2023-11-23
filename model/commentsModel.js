const db = require("../db/connection")

exports.selectCommentsByArticleId = (id) =>{
    return db.query(`
        SELECT comments.comment_id,comments.body,comments.votes,comments.author,comments.article_id,comments.created_at
        FROM comments
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC;
    `,[id])
    .then(({rows}) =>{
        if(rows.length === 0){
            return Promise.reject({code:404,msg:"not found"})
        }else{
            return rows
        }
       
    })
}