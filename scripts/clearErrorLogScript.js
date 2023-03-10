const fs = require('fs')

fs.writeFile('./logs/errorLog.txt',"",err => {
    if(err) return console.log(err)
    console.log("error Log cleared")
})
