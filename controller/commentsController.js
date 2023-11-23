const { selectCommentsByArticleId,selectPostedCommentByArticleId } = require("../model/commentsModel")


exports.getCommentsByArticleId = (req,res,next) =>{

    const id = req.params.article_id

    selectCommentsByArticleId(id).then((comments)=>{
        res.status(200).send(comments)
    })
    .catch(next)
}

exports.getPostedCommentByArticleId = (req,res,next) =>{
    
    const id = req.params.article_id

    const {username,body} = req.body

    selectPostedCommentByArticleId(username,body,id).then((comment)=>{
        res.status(200).send(comment)
    })
    .catch(next)
}