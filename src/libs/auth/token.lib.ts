import AppConfig from '../../configs/app.config';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import IUserPayload from '../../common/interfaces/userPayload';
import HttpErrors from '../error/httpErrors';
import CodeError from '../error/codeErrors';
import TypeErrors from '../error/typeError';
import AppObject from '../../common/const/app.object';
import AppConst from '../../common/const/app.const';

class TokenLib {
   static signToken(type: keyof typeof AppObject.TOKEN_ENUM, payload: IUserPayload | any) {
      const jwtConfig = AppConfig.AUTH;
      let token: string;
      try {
         switch (type) {
            case AppObject.TOKEN_ENUM.ACESS_TOKEN:
               token = jwt.sign(payload, jwtConfig.ACCESS_TOKEN_SECRET, {
                  expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRE_SECONDS,
               });
               break;
            case AppObject.TOKEN_ENUM.REFRESH_TOKEN:
               token = jwt.sign(payload, jwtConfig.REFRESH_TOKEN_SECRET, {
                  expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRE_SECONDS,
               });
               break;
            case AppObject.TOKEN_ENUM.OTP_TOKEN:
               token = jwt.sign(payload, jwtConfig.OTP_TOKEN_SECRET, {
                  expiresIn: AppConst.VERIFY_OTP_EXPIRE_TIME_SECONDS,
               });
               break;
            case AppObject.TOKEN_ENUM.RESET_TOKEN:
               token = jwt.sign(payload, AppConfig.RESET_PASSWORD.RESET_TOKEN_SECRET, {
                  expiresIn: AppConfig.RESET_PASSWORD.EXPIRE_TIME_SECONDS,
               });
               break;
            default:
               throw HttpErrors.ServerError('Token type invalid!');
         }
         return token;
      } catch (error) {
         throw error;
      }
   }

   static verifyToken(type: keyof typeof AppObject.TOKEN_ENUM, token: string): IUserPayload | any {
      const jwtConfig = AppConfig.AUTH;
      let payload: jwt.JwtPayload | string;
      try {
         switch (type) {
            case AppObject.TOKEN_ENUM.ACESS_TOKEN:
               payload = jwt.verify(token, jwtConfig.ACCESS_TOKEN_SECRET);
               break;
            case AppObject.TOKEN_ENUM.REFRESH_TOKEN:
               payload = jwt.verify(token, jwtConfig.REFRESH_TOKEN_SECRET);
               break;
            case AppObject.TOKEN_ENUM.OTP_TOKEN:
               payload = jwt.verify(token, jwtConfig.OTP_TOKEN_SECRET);
               break;
            case AppObject.TOKEN_ENUM.RESET_TOKEN:
               payload = jwt.verify(token, AppConfig.RESET_PASSWORD.RESET_TOKEN_SECRET);
               break;
            default:
               throw HttpErrors.ServerError('Token type invalid!');
         }
      } catch (error: any) {
         const err = new HttpErrors({
            code: CodeError.JWT_EXPIRE,
            type: TypeErrors.TOKEN_ERROR,
            message: error.message,
         });
         if (error instanceof jwt.TokenExpiredError) {
            err.setMessage = 'Token is Exprired!';
            throw err;
         }
         if (error instanceof jwt.JsonWebTokenError) {
            err.setMessage = error.message;
            err.setCode = CodeError.JWT_INVALID;
            throw err;
         }
         err.setCode = CodeError.BasicError[500];
         err.setType = TypeErrors.HTTP_ERROR;
         err.message = error?.message || 'Unknow error!';
         throw err;
      }
      return payload as IUserPayload;
   }

   static getToken(req: Request): { scheme: string; token: string } | null {
      const splitToken = req.get('authorization')?.split(' ');
      if (!splitToken) {
         return null;
      }
      return {
         scheme: splitToken[0],
         token: splitToken[1],
      };
   }

   static decodeToken(token: string, options?: jwt.DecodeOptions): IUserPayload {
      try {
         const decoded = jwt.decode(token, options);
         return decoded as IUserPayload;
      } catch (error) {
         throw error;
      }
   }
}

export default TokenLib;
