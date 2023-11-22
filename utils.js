const format = require("pg-format")
const db = require("./db/connection")

exports.checkIfIdExists = (table,column,id)=>{
    const query = format(` SELECT * FROM %I where %I = $1;`, table,column)

    return db.query(query,[id])
    .then(({rows}) =>{
        if(!rows.length){
            Promise.reject({status:404,msg:"not found"})
        }
        // return rows
    })
}