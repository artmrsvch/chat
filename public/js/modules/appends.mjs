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
    const chatItem = document.createElement('li');
    if (update.nick == loginInfo.nick) { 
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
        if (!chatList.children.length) {
            chatItem.classList.add('chat-user');                                     
            addNewBlock(update, chatItem);
        } else {
            if (chatList.lastElementChild.getAttribute('nick') == update.nick) {
                addNewBlock(update);
            }  else {
                chatItem.classList.add('chat-user');                                     
                addNewBlock(update, chatItem);
            }
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
        newLi.setAttribute('nick', userData.nick);
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

export {appendUser}