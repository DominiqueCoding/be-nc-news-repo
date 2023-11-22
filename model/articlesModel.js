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

exports.selectAllArticles = () =>{
    // the articles should be sorted by date in descending order.
    // there should not be a body property present on any of the article objects.

    return db.query(`
    SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,
    COUNT (comments.comment_id)
    AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `)
    .then(({rows}) =>{
        console.log(rows)
       return rows
    })
}