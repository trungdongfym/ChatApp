class RedisKey {
   static genKeyUserSession(userID: string) {
      return `session_user:${userID}`;
   }

   static getUserIdFromKeySession(key: string) {
      return key?.split(':')[1];
   }

   static genKeyRegister(gmail: string) {
      return `register:${gmail}`;
   }

   static getEmailRegisterFromKey(key: string) {
      return key?.split(':')[1];
   }

   static genKeyResetPassword(userID: string) {
      return `reset_user:${userID}`;
   }
}

export default RedisKey;
