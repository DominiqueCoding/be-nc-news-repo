const db = require("../db/connection")
const fs = require("fs/promises")

exports.selectApi = (req) =>{
    return fs.readFile('./endpoints.json')
    .then((data) =>{
        const response = JSON.parse(data)
        return response
    })
    
}