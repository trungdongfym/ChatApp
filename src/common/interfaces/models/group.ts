import AppObject from '../../const/app.object';

export interface IMember {
   user: string;
   roles: Array<keyof typeof AppObject.ROLES_GROUP_CHAT_ENUM>;
}

export default interface IGroup {
   name: string;
   members: Array<IMember>;
}
