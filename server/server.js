const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);  
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4500;

app.use(express.static(publicPath));

let users = new Array;

io.sockets.on('connection', socket => {
    socket.on('userLogin', user => {
        users.push(user);
        io.sockets.emit('usersList', users)
    });
    socket.on('userMessage', data => {
        console.log(data.fio, data.nick, data.msg)
        users.forEach(user => {  //Присваиваем последнее сообщение в массив юзеров
            if (user.nick == data.nick) {
                user.msg = data.msg
            }
        })
        socket.emit('messageAppend',data)
    });
})
server.listen(port, ()=> {
    console.log(`HELLOW FIRST SERVAK NA PORTY ${port}`);
})