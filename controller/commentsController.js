const { selectCommentsByArticleId } = require("../model/commentsModel")


exports.getCommentsByArticleId = (req,res,next) =>{

    const id = req.params.article_id

    selectCommentsByArticleId(id).then((comments)=>{
        res.status(200).send(comments)
    })
    .catch(next)
}