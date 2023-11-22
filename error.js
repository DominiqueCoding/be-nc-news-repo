exports.handlePsqlErrors = (err,req,res,next) =>{
    if(err.code === "22P02" || err.code === "23502"){
        res.status(400).send({msg: "bad request"})
    }else{
        next(err)
    }
}

exports.handleCustomErrors = (err,req,res,next) =>{
    if(err.code !== 500){
        res.status(err.code).send({msg: err.msg})
    }else{
        next(err)
    }
}

exports.handle500Errors = (err,req,res,next) =>{
    if(err.code){
        res.status(500).send({msg: "internal server error"})
    }
}

