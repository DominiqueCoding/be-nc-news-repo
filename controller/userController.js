const { selectAllUsers } = require("../model/userModel")

exports.getAllUsers = (req,res,next) =>{

    selectAllUsers().then((users)=>{
        res.status(200).send(users)
    })
    .catch(next)
}