const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);  
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 4500;


app.use(express.static(publicPath));
io.on('connection', () => {
    console.log('ZALYPA');
})

server.listen(port, ()=> {
    console.log(`HELLOW FIRST SERVAK NA PORTY ${port}`);
})