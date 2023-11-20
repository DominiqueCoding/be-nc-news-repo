exports.handlePsqlErrors = (err,req,res,next) =>{

}

exports.handle404Errors = (err,req,res,next) =>{
    if(err.status) {
        res.status(500).send({msg:err.msg})
    }
}

