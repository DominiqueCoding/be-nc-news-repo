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

exports.selectAllArticles = (topic) =>{

    let selectStringStart = (`
    SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,
    COUNT (comments.comment_id)
    AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `)

    let selectStringEnd = (`
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `)

    let queryValues = []

    const validTopics = ["mitch","cats"]

    if(topic){
        if(validTopics.includes(topic)){
            queryValues.push(topic)
            selectStringStart += `WHERE articles.topic = $1`
        }else{
            return Promise.reject({code:400,msg:"bad request"})
        }

    }

    return db.query(selectStringStart+selectStringEnd,queryValues)
    .then(({rows}) =>{
       return rows
    })
}

exports.selectPatchedArticleById = (voteQuery,id) =>{

    const checkIdExists = db.query(`
    SELECT EXISTS(SELECT 1 FROM articles WHERE article_id = $1)
    `,[id])

    return checkIdExists
    .then((existsCheckId)=>{

        if(existsCheckId.rows[0].exists){
            if(voteQuery >= 0){
                return incrementVotes(voteQuery,id)
            }else if(voteQuery < 0){
                return decrementVotes(voteQuery,id)
            }else{
                return Promise.reject({code:400,msg:"bad request"})
            }
        }else{
            return Promise.reject({code:404,msg:"not found"})
        }
    })
}


incrementVotes = (voteQuery,id) =>{

    const incrementQuery = db.query(`
        UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;
    `,[voteQuery,id])

    return incrementQuery
    .then(({rows})=>{
        return rows[0]
    })
}

decrementVotes = (voteQuery,id) =>{

    const decrementQuery = db.query(`
        UPDATE articles SET votes = (votes - $1) WHERE article_id = $2 RETURNING *;
    `,[Math.abs(voteQuery),id])

    return decrementQuery
    .then(({rows})=>{
        return rows[0]
    })
}



