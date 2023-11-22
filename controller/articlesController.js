const { selectArticleById } = require("../model/articlesModel")
const { checkIfIdExists } = require("../utils")


exports.getArticleById = (req,res,next) =>{

    const id = req.params.article_id

    const articlePromises = [selectArticleById(id), checkIfIdExists(id)]

    if(typeof id != Number){
        next
    }

    Promise.all(articlePromises)
    .then((resolveArticles) =>{
        const article = resolveArticles[0]
        res.status(200).send(article)
    })

    selectArticleById(id,next)
    .then((data)=>{
        res.status(200).send(data[0])
    })
    .catch(next)
}