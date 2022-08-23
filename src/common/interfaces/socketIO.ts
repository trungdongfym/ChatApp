import { IMessage } from './models';

export interface IServerToClientEvents {
   basicEmit: (a: number, b: string, c: Buffer) => void;
}

export interface IClientToServerEvents {
   sendMessage: (messagePayload: IMessage, response: any) => any;
}

export interface IInterServerEvents {}

export interface ISocketData {}
