import { SchemaOptions } from 'mongoose';
class AppObject {
   static readonly LOGIN_STRATEGY = {
      NORMAL: 'session',
      GOOGLE: 'google',
      FACEBOOK: 'facebook',
   };

   static readonly SCHEMA_OPTIONS: SchemaOptions = {
      toJSON: {
         virtuals: true,
         aliases: true,
      },
      toObject: {
         virtuals: true,
         aliases: true,
      },
      timestamps: true,
      versionKey: false,
   };

   static readonly Model_Name = {
      USER: 'User',
      FRIEND: 'Friend',
      MESSAGE: 'Message',
      FRIEND_WAIT: 'FriendWait',
      GROUP: 'Group',
   };

   static readonly MESSAGE_TYPE_ENUM = {
      TEXT: 'text',
      FILE: 'file',
      LINK: 'link',
   };

   static readonly MESSAGE_TYPE_ARRAY = Object.values(AppObject.MESSAGE_TYPE_ENUM);

   static readonly PROVIDER_ENUM = {
      LOCAL: 'local',
      GOOGLE: 'google',
      FACEBOOK: 'facebook',
   };

   static readonly PROVIDER_ARRAY = Object.values(AppObject.PROVIDER_ENUM);

   static readonly TOKEN_ENUM = {
      REFRESH_TOKEN: 'REFRESH_TOKEN',
      ACESS_TOKEN: 'ACESS_TOKEN',
      OTP_TOKEN: 'OTP_TOKEN',
      RESET_TOKEN: 'RESET_TOKEN',
   };

   static readonly GROUP_CHAT_TYPE_ENUM = {
      TWO_PERSON_GROUP: 'TWO_PERSON_GROUP',
      MULTI_PERSON_GROUP: 'MULTI_PERSON_GROUP',
   };

   static readonly GROUP_CHAT_TYPE_ARRAY = Object.values(AppObject.GROUP_CHAT_TYPE_ENUM);

   static readonly ROLES_GROUP_CHAT_ENUM = {
      ADMIN: 'admin',
      MEMBER: 'member',
   };

   static readonly ROLES_GROUP_CHAT_ARRAY = Object.values(AppObject.ROLES_GROUP_CHAT_ENUM);

   static readonly SOCKET_NAMESPACE_ENUM = {
      MESSAGES: '/messages',
   };
}

export default AppObject;
