import AppObject from '../../const/app.object';

export interface IMessageContent {
   content: string;
   type: keyof typeof AppObject.MESSAGE_TYPE_ENUM;
   sendTime: Date | string;
   viewers: Array<string>;
}

export default interface IMessage {
   sender: string;
   to: string;
   content: string;
   type: keyof typeof AppObject.MESSAGE_TYPE_ENUM;
   sendTime: Date | string;
   viewers: Array<string>;
}
