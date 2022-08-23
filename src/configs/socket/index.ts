import { Server, Namespace } from 'socket.io';
import http from 'http';
import {
   IClientToServerEvents,
   IInterServerEvents,
   IServerToClientEvents,
   ISocketData,
} from '../../common/interfaces/socketIO';
import messageNameSpaceConfig from './messageSocket.config';

let socketIO: Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>;
let messageSocketNSP: Namespace<
   IClientToServerEvents,
   IServerToClientEvents,
   IInterServerEvents,
   ISocketData
>;

function socketIOConfig(httpServer: http.Server) {
   socketIO = new Server<
      IClientToServerEvents,
      IServerToClientEvents,
      IInterServerEvents,
      ISocketData
   >(httpServer);

   messageSocketNSP = messageNameSpaceConfig(socketIO);
}

export { socketIO, messageSocketNSP, socketIOConfig };
