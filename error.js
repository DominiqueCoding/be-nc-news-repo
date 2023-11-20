exports.handlePsqlErrors = (err,req,res,next) =>{
    if(err.code === "22PO2" || err.code === "23502"){
        res.status(400).send({msg: "bad request"})
    }
}



