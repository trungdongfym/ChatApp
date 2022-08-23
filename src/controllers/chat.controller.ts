import { Request, Response } from 'express';
import AppObject from '../common/const/app.object';
import LinkConst from '../common/const/link.const';
import { IMessage, IUser } from '../common/interfaces/models';
import ChatService from '../services/chat.service';

const chatSrv = new ChatService();

class ChatController {
   public async sendMessage(messagePayload: IMessage, res: any) {
      try {
         const result = await chatSrv.sendMessge(messagePayload);
      } catch (error) {
         throw error;
      }
   }

   public async getHomeMessage(req: Request, res: Response) {
      const localOptions = { data: {}, errors: null, info: null };
      const viewMessageHomePath = LinkConst.viewMessagePath;
      const viewErrorPath = LinkConst.viewErrorsPath;
      try {
         const user: IUser = req.user as any;
         (localOptions.data as any).user = {
            userID: user.id,
            name: user.fullname,
            avatar: user?.avatar || '',
         };

         res.render(viewMessageHomePath, localOptions);
      } catch (error) {
         localOptions.errors = error?.message || 'Something wrong!';
         res.render(viewErrorPath, localOptions);
      }
   }
}

export default ChatController;
