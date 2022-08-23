import { Request, Response } from 'express';
import LinkConst from '../common/const/link.const';
import { IUser } from '../common/interfaces/models';
import HttpErrors from '../libs/error/httpErrors';
import UserService from '../services/user.service';

const userService = new UserService();

class UserController {
   public async listUser(req: Request, res: Response) {
      const pathViewUser = LinkConst.viewUserListPath;
      const pathErrorView = LinkConst.viewErrorsPath;
      const localOptions = { data: {}, errors: null, info: null };
      try {
         const { search } = req.query;

         const actor: IUser = req.user as any;
         (localOptions.data as any).user = {
            userID: actor.id,
            name: actor.fullname,
            avatar: actor.avatar,
         };

         const users = await userService.listUsers(actor, search as string);
         (localOptions.data as any).listUser = users ?? [];
         if (!req.xhr) {
            res.render(pathViewUser, localOptions);
         } else {
            res.json(users);
         }
      } catch (error) {
         localOptions.errors = error.message;
         if (!req.xhr) {
            res.render(pathErrorView, localOptions);
         } else {
            res.status(500).json(error.message || 'Unknow errors');
         }
      }
   }

   public async friendRequest(req: Request, res: Response) {
      try {
         const { frendRequestID } = req.body;
         const actor = req.user;
         const result = await userService.requestAddFriend(frendRequestID, actor as IUser);
         res.json(result);
      } catch (error) {
         const err = HttpErrors.ServerError(error?.message);
         res.status(err.status).json(err.message);
      }
   }
}

export default UserController;
