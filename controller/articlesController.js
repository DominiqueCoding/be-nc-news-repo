const { selectArticleById, selectAllArticles, SelectPatchedArticleById } = require("../model/articlesModel")

exports.getArticleById = (req,res,next) =>{

    const id = req.params.article_id

    selectArticleById(id)
    .then((article)=>{
        res.status(200).send(article)
    })
    .catch(next)
}

exports.getAllArticles = (req,res,next) =>{
    selectAllArticles().then((articles)=>{
        res.status(200).send(articles)
    })
    .catch(next)
}

exports.getPatchedArticleById = (req,res,next) =>{
    const id = req.params.article_id
    const voteQuery = req.body.inc_votes

    SelectPatchedArticleById(voteQuery,id).then((articles)=>{
        res.status(200).send(articles)
    })
    .catch(next)
}