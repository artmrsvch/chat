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

let logInusers = new Array;
let signInUsers = new Array;

io.sockets.on('connection', socket => {
    socket.on('userLogin', user => {
        if (signInUsers.length) {
            let flag;
            signInUsers.forEach(elem => {
                if (elem.nick == user.nick && elem.fio == user.fio) {
                    flag = true;
                    logInusers.push(elem);
                }
            })
            if (!flag) {
                signInUsers.push(user);
                logInusers.push(user);
                flag = false;
            }
        } else {
            signInUsers.push(user);
            logInusers.push(user);
        }
        io.sockets.emit('usersList', logInusers)
    });
    socket.on('userMessage', data => {
        io.sockets.emit('appendDialog', data);
        appendUser(data);
    });
    socket.on('disconnect', recall => {
        console.log(recall)
    })
})
server.listen(port, ()=> {
    console.log(`HELLOW FIRST SERVAK NA PORTY ${port}`);
})

function appendUser (data) {
    logInusers.forEach(user => {
        if (user.nick == data.nick) {
            user.msg = data.msg
        }
    });
    io.sockets.emit('usersList', logInusers);
}