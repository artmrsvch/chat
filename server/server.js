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

let activeUsers = new Array;
let memoryUsers = new Array;

io.sockets.on('connection', socket => {
    socket.on('userLogin', user => {
        user.id = socket.id
        if (memoryUsers.length) {
            let flag;
            memoryUsers.forEach(elem => {
                if (elem.nick == user.nick && elem.fio == user.fio) {
                    flag = true;
                    elem.id = socket.id
                    activeUsers.push(elem);
                }
            })
            if (!flag) {
                memoryUsers.push(user);
                activeUsers.push(user);
                flag = false;
            }
        } else {
            memoryUsers.push(user);
            activeUsers.push(user);
        }
        io.sockets.emit('usersList', activeUsers)
    });
    socket.on('userMessage', data => {
        io.sockets.emit('appendDialog', data);
        appendUser(data);
    });
    socket.on('disconnect', () => {
        activeUsers.forEach( userItem => {
            if (userItem.id == socket.id) {
                activeUsers.splice(activeUsers.indexOf(userItem), 1);
                io.sockets.emit('usersList', activeUsers)
            }
        });
    })
})
server.listen(port, ()=> {
    console.log(`HELLOW FIRST SERVAK NA PORTY ${port}`);
})

function appendUser (data) {
    activeUsers.forEach(user => {
        if (user.nick == data.nick) {
            user.msg = data.msg
        }
    });
    io.sockets.emit('usersList', activeUsers);
}