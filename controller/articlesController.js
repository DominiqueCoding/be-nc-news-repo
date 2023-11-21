const { selectArticleById } = require("../model/articlesModel")


exports.getArticleById = (req,res,next) =>{

    const id = req.params.article_id

    selectArticleById(id).then((data)=>{
        res.status(200).send(data)
    })
    .catch(next)
}