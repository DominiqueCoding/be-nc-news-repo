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

exports.selectPostedCommentByArticleId = (username,body,id) =>{

    const checkUsernameExists = db.query(`
    SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)
    `,[username])

    const checkIdExists = db.query(`
    SELECT EXISTS(SELECT 1 FROM articles WHERE article_id = $1)
    `,[id])

    if(!username || !body){
        return Promise.reject({code:400,msg:"bad request"})
    }

    return Promise.all([checkUsernameExists,checkIdExists])
    .then(([existsCheckUser,existsCheckId])=>{

        if(!existsCheckUser.rows[0].exists || !existsCheckId.rows[0].exists){
            return Promise.reject({code:404,msg:"not found"})
        }else{
            return PostQuery(username,body,id)
        }

    })
}

PostQuery = (username,body,id) =>{
    const currentDate = new Date()

    const insertQuery = db.query(`
    INSERT INTO comments (body,author,article_id,created_at)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,[body,username,id,currentDate])

    return insertQuery
    .then(({rows})=>{
        return rows
    })
}

exports.selectDeletedCommentByCommentId = (id)=>{

    const checkIdExists = db.query(`
    SELECT EXISTS(SELECT 1 FROM comments WHERE comment_id = $1)
    `,[id])

    const deleteCommentQuery = db.query(`
    DELETE FROM comments WHERE comment_id = $1 RETURNING *;
    `,[id])

    return Promise.all([checkIdExists,deleteCommentQuery])
    .then(([checkIdExists,rows])=>{

        if(!checkIdExists.rows[0].exists){
            return Promise.reject({code:404,msg:"not found"})
        }else{
            return rows
        }
    })
}