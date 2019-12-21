const socket = io();
const fileReader = new FileReader;
const sessions = sessionStorage;

const autorizModal = document.querySelector('.autorization');
const autorizName = document.querySelector('.input-name');
const autorizNick = document.querySelector('.input-nick');
const autorizPhoto = document.querySelector('.file-box');

const photoInputBox = document.querySelector('.file-box');

const chatMessage = document.querySelector('.chat-block__textarea');
const sendChatMessage = document.querySelector('.chat-block__submit-button');
const userList = document.querySelector('.info-block__user-list');

const quantityUser = document.querySelector('.chat-block__user-quantity');
const chatList = document.querySelector('.chat');

let loginInfo = new Object;

autorizModal.addEventListener('click', function (e) {
    if (e.target.className == 'autorization-close__btn') {
        //this.style.display = 'none'
    } else if (e.target.className == 'autorization__submit-button') {
        if (autorizName.value && autorizNick.value != '') {
            let photo;

            if (fileReader.result == null) {
                photo = './no-image.jpg'
            } else {
                photo = fileReader.result
            }
            
            loginInfo = {
                fio: autorizName.value,
                nick: autorizNick.value,
                photo: photo
            };
            socket.emit('userLogin', loginInfo);
            this.style.display = 'none'
        } else {
            alert('Поля ФИО и Ник должны быть заполнены!')
        }  
    }
})

fileReader.addEventListener('load', () => {
    photoInputBox.style.background = `url(${fileReader.result}) center center / cover no-repeat`
})

photoInputBox.addEventListener('change', (e) => {
    changeFile (e.target.files)
})
photoInputBox.addEventListener('dragover', (e) => {
    e.preventDefault();
})
photoInputBox.addEventListener('drop', (e) => {
    e.preventDefault();
    changeFile (e.dataTransfer.files)
})
function changeFile (e) {
    const [file] = e;
    if (file) {
        if (file.size > 512 * 1024 || file.type != 'image/jpeg') {
            if (file.size > 512 * 1024) {
                alert('Размер файла не должен превышать 512кб')
            } else {
                alert ('Можно загружать только JPEG файлы')
            }
        } else {
            fileReader.readAsDataURL(file);
        }
    }    
}

function appendUser (user) {
    const userItem = document.createElement('li');
    if (!user.msg) {
        user.msg = 'Присоеденился к чату';
    }
    userItem.classList.add('info-block__user-item');
    userItem.innerHTML = `<div class="info-block__user-avatar" style="background-image: url(${user.photo})"></div>
    <div class="info-block__user-data">
        <span class="info-block__user-name">${user.fio}</span>
        <span class="info-block__user-lastMassege">${user.msg}</span>
    </div>`;
    userList.appendChild(userItem);
}

function appendMessage (update) {
    if (update.nick == loginInfo.nick) { 
        const chatItem = document.createElement('li');
        if (!chatList.children.length) {
            chatItem.classList.add('chat-user', 'chat-user_me');                                     
            addNewBlock(update, chatItem);
        } else {
            if (chatList.lastElementChild.classList.contains('chat-user_me')) {
                addNewBlock(update);
            } else {                                                             
                chatItem.classList.add('chat-user', 'chat-user_me');                                     
                addNewBlock(update, chatItem);
            }
        }                           
    } else {      
        let lastNodeMessage;
        try {
            lastNodeMessage = chatList.lastElementChild.children[1].lastElementChild.firstElementChild
        } catch (e) {
            lastNodeMessage = '';
        }
        let userNodeName;

        for (let node of userList.children) {
            if (node.children[1].children[1].textContent == lastNodeMessage.textContent) {
                userNodeName = node.children[1].children[0].textContent;
                break;
            } 
        }
        if(userNodeName == update.fio) {
            addNewBlock(update);
        } else {
            const chatItem = document.createElement('li');
            chatItem.classList.add('chat-user');                                     
            addNewBlock(update, chatItem);
        }
    }
}

function addNewBlock (userData, newLi) {
    if (!newLi) {
        const chatItemContent = chatList.lastElementChild.children[1];
        const chatDivContain = document.createElement('div');
        chatDivContain.classList.add('chat-message');
        chatDivContain.innerHTML = `<span class="chat-message__text">${userData.msg}</span>
        <span class="chat-message__time">${userData.date}</span>`;
        chatItemContent.appendChild(chatDivContain);
    } else {
        newLi.innerHTML = `<div class="chat-user__avatar" style="background-image: url(${userData.photo})"></div>
        <div class="chat-user__content">
            <div class="chat-message">
                <span class="chat-message__text">${userData.msg}</span>
                <span class="chat-message__time">${userData.date}</span>
            </div>
        </div>`
        chatList.appendChild(newLi);
    }
}

function formatDate(date) {

    let mi = date.getMinutes();
    if (mi < 10) mi = '0' + mi;

    let hr = date.getHours();
    if (hr < 10) hr = '0' + hr;
    
    return hr +':'+ mi;
}


sendChatMessage.addEventListener('click', ()=>{
    if (chatMessage.value != '') {
        let thisDate = formatDate(new Date);

        socket.emit('userMessage', { 
            fio: loginInfo.fio,
            nick: loginInfo.nick,
            msg: chatMessage.value,
            photo: loginInfo.photo,
            date: thisDate
         });
         chatMessage.value = '';
    } else {
        alert('Пусто же, нужно что-то написать')
    }
})

socket.on('appendDialog', (data) => {
    appendMessage(data);
    socket.emit('cookie', {
        nick: loginInfo.nick,
        fio: loginInfo.fio,
        chatlog: chatList.innerHTML  
    })
})

socket.on('usersList', users => {
    userList.innerHTML = '';
    users.forEach(user => {
        appendUser(user)
    });
    quantityUser.textContent = `Участников: ${userList.children.length}`;
})
socket.on('parse', cooks => {
    loginInfo.photo = cooks.photo;
    chatList.innerHTML = cooks.logs;
})