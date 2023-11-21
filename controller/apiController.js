const { selectApi } = require("../model/apiModel")

exports.getApi = (req,res,next) =>{
    selectApi(req)
    .then((api) =>{

        res.status(200).send(api)
    })
    .catch(next)
}