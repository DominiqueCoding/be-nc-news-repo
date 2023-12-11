const express = require('express')
const {handlePsqlErrors, handle500Errors, handleCustomErrors } = require('./error')
const { getTopics } = require('./controller/topicsController')
const { getApi } = require('./controller/apiController')
const { getArticleById, getAllArticles, getPatchedArticleById } = require('./controller/articlesController')
const { getCommentsByArticleId, getPostedCommentByArticleId, getDeletedCommentByCommentId } = require('./controller/commentsController')
const { getAllUsers } = require('./controller/userController')
const cors = require('cors');



const app = express()

app.use(cors());

app.use(express.json())

app.get('/api/topics',getTopics)

app.get('/api',getApi)

app.get("/api/articles/:article_id",getArticleById)

app.get("/api/articles",getAllArticles)

app.get("/api/articles/:article_id/comments",getCommentsByArticleId)

app.post("/api/articles/:article_id/comments",getPostedCommentByArticleId)

app.patch("/api/articles/:article_id",getPatchedArticleById)

app.delete("/api/comments/:comment_id",getDeletedCommentByCommentId)

app.get("/api/users",getAllUsers)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handle500Errors)

module.exports = app

