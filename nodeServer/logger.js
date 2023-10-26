const fs = require('fs')

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
    log(text, type="info", local="undefined") {
        if (typeof text === "object") text = JSON.stringify(text)
        let logString = `${new Date().toISOString()} - ${this.ownerFile} - ${type} - ${local}: ${text}\n`
        console.log(logString)
        fs.appendFile(`${this.folder}/log${new Date().getUTCMonth()+1}-${new Date().getUTCDate()}-${new Date().getUTCFullYear()}.log`, logString, (err) => {
            if (err) {
                console.error('Error appending to log file:', err);
            }
        });
    }
}

// const logger = new Logger("asdFile")
// logger.log({asd: 123})
// logger.log("{asd: 123}")



module.exports = Logger