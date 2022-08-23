
window.onload = (e) => {
   const formMessage = document.getElementById('formMessage');
   const textContainer = document.getElementById('textContainer');
   const messageList = document.getElementById('message__list');
   const inputMessage = document.getElementById('inputMessage');

   const emojiStandAlone = $("#inputMessage").emojioneArea({
      pickerPosition: "top",
      placeholder: "Aa",
      container: "#textContainer",
      saveEmojisAs: 'unicode',
      shortnames: true,
      useInternalCDN: true,
      attributes: {
         spellcheck: true,
      }
   });
   const emojionearea = emojiStandAlone[0].emojioneArea;

   const handleSendMessage = (e) => {
      e.preventDefault();
      const textRaw = emojionearea.getText();
      if (textRaw === '') return;

      const textMessage = emojione.toImage(textRaw);

      // Add node doc to messageList
      const messageItem = createMessageItemMe(textMessage);
      // If have only emotion
      if (/^\s*$/.test(messageItem.textContent)) {
         messageItem.classList.add('only__emotion');
      }
      socket.emit('test', textRaw, (res) => {
         console.log(res);
      });
      messageList.appendChild(messageItem);
      //End add node doc to messageList

      emojionearea.setText('');
   }

   formMessage.addEventListener('submit', (e) => {
      handleSendMessage(e);
   });

   formMessage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSendMessage(e);
      }
   });
}