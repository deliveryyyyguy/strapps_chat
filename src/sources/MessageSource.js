import Actions from '../actions';
import Firebase from 'firebase';

let firebaseRef = null;

let MessageSource = {
  getMessages: {
    remote(state){

      if(firebaseRef){
        firebaseRef.off();
      }

      firebaseRef = new Firebase('https://react-stack-49b8c.firebaseio.com/messages/' +
        state.selectedChannel.key);

      return new Promise((resolve, reject) => {
        firebaseRef.once("value", (dataSnapshot) => {
          var messages = dataSnapshot.val();
          resolve(messages);


          setTimeout(()=> {
            firebaseRef.on("child_added", ((msg) => {
              let msgVal = msg.val();
              msgVal.key = msg.key();
              Actions.messageReceived(msgVal);
            }));
          }, 10);

        })
      });
    },
    success: Actions.messagesReceived,
    error: Actions.messagesFailed,
    loading: Actions.messagesLoading
  },
  sendMessage: {
    remote(state){
      return new Promise((resolve, reject)=> {
        if(!firebaseRef){
          return resolve();
        }

        firebaseRef.push({
          "message": state.message,
          "date": new Date().toUTCString(),
          "author": "Rick King",
          "userId": "1",
          "profilePic": "https://lh3.googleusercontent.com/-hF2FXDjv-2g/V4Gx9vHlQeI/AAAAAAAAABs/h8QAkXgxpDYXwGxWaFJMJaI6ZGMtNRaTwCKgB/w139-h140-p/homestead.jpg"
          ////
          //"date": new Date().toUTCString(),
          //"author": state.user.google.displayName,
          //"userId": state.user.uid,
          //"profilePic": state.user.google.profileImageURL
        });
        resolve();
      });
    },
    success: Actions.messageSendSuccess,
    error: Actions.messageSendError
  },
}

export default MessageSource;
