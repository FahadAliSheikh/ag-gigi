const http = require('http');
const app = require('./app');
const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port,()=>{
    console.log('server listening to port '+ port); 
});