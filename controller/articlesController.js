const { selectArticleById, selectAllArticles, selectPatchedArticleById } = require("../model/articlesModel")

exports.getArticleById = (req,res,next) =>{

    const id = req.params.article_id

    selectArticleById(id)
    .then((article)=>{
        res.status(200).send(article)
    })
    .catch(next)
}

exports.getAllArticles = (req,res,next) =>{
    
    const {topic} = req.query
    const {sort_by} = req.query
    const {order_by} = req.query

    selectAllArticles(topic,sort_by,order_by).then((articles)=>{
        res.status(200).send(articles)
    })
    .catch(next)
}

exports.getPatchedArticleById = (req,res,next) =>{
    const id = req.params.article_id
    const voteQuery = req.body.inc_votes

    selectPatchedArticleById(voteQuery,id).then((articles)=>{
        res.status(200).send(articles)
    })
    .catch(next)
}