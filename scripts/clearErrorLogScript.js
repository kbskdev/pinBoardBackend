const fs = require('fs')

fs.writeFile('./common/errorLog.txt',"",err => {
    if(err) return console.log(err)
    console.log("error Log cleared")
})
