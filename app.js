const express = require('express')
const { handle404Errors } = require('./error')
const { getTopics } = require('./controller/topicsController')
const { getApi } = require('./controller/apiController')
const { getArticleById } = require('./controller/articlesController')
const app = express()

app.get('/api/topics',getTopics)

app.get('/api',getApi)

app.get("/api/articles/:article_id",getArticleById)

module.exports = app

