const fs = require('fs')
// const request = require("axios") //boilerplate for scaling the log service

class Logger {
    constructor(ownerFile) {
        this.ownerFile = ownerFile
        this.folder = "/usr/src/app/logs"
        fs.mkdir(this.folder, (err) => {
            if (err) {
                console.error('Error creating dir:', err);
            }
        });
    }
    log(text, type="INFO", local=undefined) {
        try {
            if (typeof text === "object") text = JSON.stringify(text)
        } catch (err) {
            console.log(text)
            console.log(err)
        }
        let logString = `${new Date().toISOString()} - ${type} - ${this.ownerFile}${local? " - " + local : ""}: ${text}`
        console.log(logString)
        fs.appendFile(`${this.folder}/log${new Date().getUTCMonth()+1}-${new Date().getUTCDate()}-${new Date().getUTCFullYear()}.log`, logString+"\n", (err) => {
            if (err) {
                console.error('Error appending to log file:', err);
            }
        });
        //boilerplate for scaling the log service
        // request.post(
        //     'http://127.0.0.1:3100/addLog', 
        //     {logString}, 
        //     {headers: {"Content-Type": "application/json"}}
        // ).then(response =>{
        //     console.log('Server Response:', response.data);
        // }).catch(error => {
        //     console.error('Error making request:', error);
        // })
    }
}

// const logger = new Logger("asdFile")
// logger.log({asd: 123})
// logger.log("{asd: 123}")



module.exports = Logger