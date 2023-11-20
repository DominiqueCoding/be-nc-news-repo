const express = require('express')
const { handle404Errors } = require('./error')
const { getTopics } = require('./controller/topicsController')
const app = express()

app.get('/api/topics',getTopics)

module.exports = app

