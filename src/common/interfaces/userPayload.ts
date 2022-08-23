import AppObject from '../const/app.object';

export default interface IUserPayload {
   id: string;
   provider: keyof typeof AppObject.PROVIDER_ENUM;
   iat: number;
   exp: number;
}
