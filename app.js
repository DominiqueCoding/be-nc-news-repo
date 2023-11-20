const express = require('express')
const { handle404Errors } = require('./error')
const { getTopics } = require('./controller/topicsController')
const app = express()


app.use(express.json())

app.get('/api/topics',getTopics)




app.use(handle404Errors)

module.exports = app

