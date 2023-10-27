const fs = require('fs')
const fastify = require('fastify')({ logger: true });
folder = "/usr/src/app/logs"
fs.mkdir(folder, (err) => {
    if (err) {
        console.error('Error creating dir:', err);
    }
});
fastify.get('/', async (request, reply) => {
    return "server is running"    
});
fastify.post('/addLog', async (request, reply) => {
    console.log("adding log")
    console.log(request.body)
    fs.appendFile(`${folder}/log${new Date().getUTCMonth()+1}-${new Date().getUTCDate()}-${new Date().getUTCFullYear()}.log`, request.body.logString+"\n", (err) => {
        if (err) {
            console.error('Error appending to log file:', err);
        }
    });
    return "log saved";
});
const port = process.env.PORT || 3100
fastify.listen({
  host: "0.0.0.0",
  port:port
  }, 
  (err) => {
    if (err) {
      fastify.log.error(err);
      // process.exit(1);
    }
  }
);