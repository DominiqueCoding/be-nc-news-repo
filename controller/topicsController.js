const { selectTopics } = require("../model/topicsModel")

exports.getTopics = (req,res,next) =>{
    selectTopics(req)
    .then((topics) =>{

        res.status(200).send(topics)
    })
    .catch(next)
}