const articles = require("../db/data/test-data/articles")
const { selectArticleById, selectAllArticles } = require("../model/articlesModel")
const { checkIfIdExists } = require("../utils")


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