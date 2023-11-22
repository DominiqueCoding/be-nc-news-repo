exports.handlePsqlErrors = (err,req,res,next) =>{
    if(err.code === "22PO2" || err.code === "23502"){
        res.status(400).send({msg: "bad request"})
    }else{
        next(err)
    }
}

exports.handle404Errors = (err,req,res,next) =>{

    if(err.code){
        res.status(404).send({msg: "not found"})
    }else{
        next(err)
    }
}

exports.handle500Errors = (err,req,res,next) =>{
    if(err.code){
        res.status(500).send({msg: "internal server error"})
    }
}

