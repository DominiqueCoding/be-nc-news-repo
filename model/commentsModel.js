const db = require("../db/connection")

exports.selectCommentsByArticleId = (id) =>{
    const selectionQuery = db.query(`
    SELECT comments.comment_id,comments.body,comments.votes,comments.author,comments.article_id,comments.created_at
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;
    `,[id])

    const checkExistsQuery = db.query('SELECT EXISTS(SELECT 1 FROM articles WHERE article_id = $1)',[id])

    return Promise.all([selectionQuery,checkExistsQuery])
    .then(([{rows},existsCheck]) =>{

        if(rows.length === 0 && !existsCheck.rows[0].exists){
            return Promise.reject({code:404,msg:"not found"})
        }else{
            return rows
        }
    })
}