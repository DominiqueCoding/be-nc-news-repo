const express = require('express')
const {handlePsqlErrors, handle500Errors, handleCustomErrors } = require('./error')
const { getTopics } = require('./controller/topicsController')
const { getApi } = require('./controller/apiController')
const { getArticleById, getAllArticles } = require('./controller/articlesController')
const app = express()

app.get('/api/topics',getTopics)

app.get('/api',getApi)

app.get("/api/articles/:article_id",getArticleById)

app.get("/api/articles",getAllArticles)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handle500Errors)

module.exports = app

