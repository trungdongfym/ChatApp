const createMessageItemMe = (content) => {
   const liEl = document.createElement('li');
   liEl.classList.add('message__item', 'me');

   const child = `<div class="wrapper right__message">
      <div class="wrapper__content">
         <div class="wrapper__content__text">${content}</div>
      </div>
   </div>`;
   liEl.innerHTML = child;

   return liEl;
}

const createUserItem = (user) => {
   const liEl = document.createElement('li');
   liEl.classList.add('userList__userItem');
   const defaultAvatar = 'https://img.icons8.com/color/96/000000/circled-user-male-skin-type-6--v1.png';

   const { _id, fullname, avatar = defaultAvatar } = user;

   const child = `<div class="userList__userItem__wrapper">
      <a href="/users/${_id}" class="linkToUser">
      <div class="linkToUser__avatar">
         <img src="${avatar}" alt="${fullname}">
      </div>
      <div class="linkToUser__name">
         ${fullname}
      </div>
      </a>
      <button class="addFriendsBtn" id="${_id}">
         Kết bạn
      </button>
   </div>`;
   liEl.innerHTML = child;

   return liEl;
}