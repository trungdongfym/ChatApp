import { Socket } from 'socket.io';
import { IUser } from '../../common/interfaces/models';
import {
   IClientToServerEvents,
   IInterServerEvents,
   IServerToClientEvents,
   ISocketData,
} from '../../common/interfaces/socketIO';
import ChatController from '../../controllers/chat.controller';
import HttpErrors from '../../libs/error/httpErrors';
import User from '../../models/user.model';

const chatCtrl = new ChatController();

class ConnectHandle {
   public static async messageConnectHandle(
      socket: Socket<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>
   ) {
      try {
         const user: IUser = (socket.request as any).user;
         const { id } = user;
         // Set user online
         const result = await User.findByIdAndUpdate(id, {
            online: true,
            lastTimeOnline: new Date(),
         });

         if (!result) {
            throw HttpErrors.ServerError(`Can't update user online!`);
         }
         console.log(result.toJSON());
      } catch (error) {
         throw HttpErrors.ServerError(error.message);
      }
   }

   public static async messageDisconnectHandle(
      socket: Socket<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>,
      reason: string
   ) {
      try {
         const user: IUser = (socket.request as any).user;
         const { id } = user;
         // Set user online
         const result = await User.findByIdAndUpdate(id, {
            online: false,
            lastTimeOnline: new Date(),
         });

         if (!result) {
            throw HttpErrors.ServerError(`Can't update user offline!`);
         }
         console.log(result.toJSON());
      } catch (error) {
         throw HttpErrors.ServerError(error.message);
      }
   }
}

export default ConnectHandle;
