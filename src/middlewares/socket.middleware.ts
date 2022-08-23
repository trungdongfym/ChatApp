import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import IUserPayload from '../common/interfaces/userPayload';
import cookie from 'cookie';
import HttpErrors from '../libs/error/httpErrors';
import TypeErrors from '../libs/error/typeError';
import AppConst from '../common/const/app.const';
import cookieParser from 'cookie-parser';
import { AppConfig } from '../configs';
import TokenLib from '../libs/auth/token.lib';
import User from '../models/user.model';

class SocketMiddleware {
   public static async checkJwt(socket: Socket, next: (err?: ExtendedError) => void) {
      try {
         const cookieStr = socket.handshake.headers.cookie;
         const unauthorizeError = HttpErrors.Unauthorized('unauthorized', TypeErrors.TOKEN_ERROR);
         if (cookieStr) {
            const cookies = cookie.parse(cookieStr);

            const accessCookie = cookies[AppConst.COOKIE_NAME_ACCESS_TOKEN];
            if (!accessCookie) {
               return next(unauthorizeError);
            }

            const accessToken = cookieParser.signedCookie(
               accessCookie,
               AppConfig.AUTH.SESSION_SECRET
            );

            if (!accessToken) {
               return next(unauthorizeError);
            }

            const payloadToken: IUserPayload = TokenLib.verifyToken(
               'ACESS_TOKEN',
               accessToken as string
            );

            const { id } = payloadToken;

            const user = await User.findById(id);

            if (!user) {
               return next(HttpErrors.InvalidToken('Token invalid!'));
            }

            (socket.request as any).user = user.toJSON();

            next();
         } else {
            next(unauthorizeError);
         }
      } catch (error) {
         next(error);
      }
   }
}

export default SocketMiddleware;
