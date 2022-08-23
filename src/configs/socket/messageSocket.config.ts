import { Server } from 'socket.io';
import AppObject from '../../common/const/app.object';
import {
   IClientToServerEvents,
   IInterServerEvents,
   IServerToClientEvents,
   ISocketData,
} from '../../common/interfaces/socketIO';
import ChatController from '../../controllers/chat.controller';
import SocketMiddleware from '../../middlewares/socket.middleware';
import ConnectHandle from './connect.handle';

const chatCtrl = new ChatController();

function messageNameSpaceConfig(
   socketIO: Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>
) {
   const messageSocketNSP = socketIO.of(AppObject.SOCKET_NAMESPACE_ENUM.MESSAGES);
   // Middleware config
   messageSocketNSP.use(SocketMiddleware.checkJwt);
   //End middleware config
   messageSocketNSP.on('connection', async (socket) => {
      try {
         await ConnectHandle.messageConnectHandle(socket);

         socket.on('disconnect', (reason) => {
            ConnectHandle.messageDisconnectHandle(socket, reason);
         });
         console.log((socket.request as any).user);
         socket.on('sendMessage', chatCtrl.sendMessage);
      } catch (error) {
         socket.disconnect();
      }
   });

   return messageSocketNSP;
}

export default messageNameSpaceConfig;
