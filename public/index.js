const socket = io();
const autorizModal = document.querySelector('.autorization');
const autorizName = document.querySelector('.input-name');
const autorizNick = document.querySelector('.input-nick');

const chatMessage = document.querySelector('.chat-block__textarea');
const sendChatMessage = document.querySelector('.chat-block__submit-button');
const userList = document.querySelector('.info-block__user-list');

let loginInfo = new Object;

autorizModal.addEventListener('click', function (e) {
    if (e.target.className == 'autorization-close__btn') {
        //this.style.display = 'none'
    } else if (e.target.className == 'autorization__submit-button') {
        if (autorizName.value && autorizNick.value != '') {
            loginInfo = {
                fio: autorizName.value,
                nick: autorizNick.value
            };
            socket.emit('userLogin', loginInfo);
            this.style.display = 'none'
        } else {
            alert('Поля ФИО и Ник должны быть заполнены!')
        }  
    }
})

function appendUser (user) {
    const userItem = document.createElement('li');

    userItem.classList.add('info-block__user-item');
    userItem.innerHTML = `<div class="info-block__user-avatar"></div>
    <div class="info-block__user-data">
        <span class="info-block__user-name">${user.fio}</span>
        <span class="info-block__user-lastMassege">Тут будет ласт сообщение</span>
    </div>`;
    userList.appendChild(userItem);
}
sendChatMessage.addEventListener('click', ()=>{
    if (chatMessage.value != '') {
        socket.emit('userMessage', { 
            fio: loginInfo.fio,
            nick: loginInfo.nick,
            msg: chatMessage.value
         });
         chatMessage.value = '';
    } else {
        alert('Пусто же, нужно что-то написать')
    }
})

socket.on('connection', (socket) => {
    console.log(socket);
    
})
socket.on('messageAppend', (data) => {
    console.log(data)
})
socket.on('usersList', users => {
    userList.innerHTML = '';
    users.forEach(user => {
    appendUser(user)
    });
})