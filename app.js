const express = require('express')
const { handle404Errors } = require('./error')
const { getTopics } = require('./controller/topicsController')
const { getApi } = require('./controller/apiController')
const app = express()

app.get('/api/topics',getTopics)

app.get('/api',getApi)

module.exports = app

