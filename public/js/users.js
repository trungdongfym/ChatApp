let timeDeleyCallApi = null;
const baseURL = 'http://localhost:5000/users';

const handleAddFriend = async (user) => {
   const actor = JSON.parse(localStorage.getItem('user'));
   if (!actor) {
      window.location.replace('/login');
      return;
   }

   const { _id: frendRequestID } = user;

   try {
      const response = await fetch(`${baseURL}/friendRequest`, {
         method: 'POST',
         body: JSON.stringify({ frendRequestID }),
         headers: {
            'Content-Type': 'application/json'
         }
      });

      const result = await response.json();

      console.log(result);
   } catch (error) {
      console.log('Add friend error:', error);
   }
}

const handleSearchUser = (e) => {
   const searchValue = e?.target?.value || '';
   if (timeDeleyCallApi) {
      clearTimeout(timeDeleyCallApi);
   }

   timeDeleyCallApi = setTimeout(async () => {
      const userListElement = document.getElementsByClassName('userList')[0];
      try {
         const res = await fetch(`${baseURL}?${new URLSearchParams({ search: searchValue })}`, {
            headers: {
               'X-Requested-With': 'XMLHttpRequest'
            }
         });
         const users = await res.json();

         if (users.length === 0) {
            userListElement.innerHTML = 'Không tìm thấy người dùng nào!';
         } else {
            userListElement.innerHTML = '';
         }

         for (const user of users) {
            userListElement.appendChild(createUserItem(user));

            const addFriendBtn = document.getElementById(user._id);
            addFriendBtn.addEventListener('click', () => handleAddFriend(user));
         }
      } catch (error) {
         console.log('Error call search user:', error);
      }
   }, 1000);
}

window.onload = (e) => {
   const inputSearchUser = document.getElementById('searchUser');
   const addFriendBtns = document.getElementsByClassName('addFriendsBtn');
   // fetch user
   handleSearchUser('');

   inputSearchUser.addEventListener('input', handleSearchUser);
   for (const addFriendBtn of addFriendBtns) {
      addFriendBtn.addEventListener('click', handleAddFriend);
   }
}