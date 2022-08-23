import IRegister from '../../../common/interfaces/register';
import IResetPassword from '../../../common/interfaces/resetPassword';
import { AppConfig, redisClient } from '../../../configs';
import HttpErrors from '../../error/httpErrors';
import RedisKey from './redisKey';

class RedisLib {
   static getClient() {
      return redisClient;
   }

   static async addUserSession(userID: string, value: string) {
      try {
         const res = await redisClient.set(
            RedisKey.genKeyUserSession(userID),
            value,
            'EX',
            AppConfig.AUTH.ACCESS_TOKEN_EXPIRE_SECONDS,
            'NX'
         );
         return res;
      } catch (error: any) {
         const ioError = HttpErrors.IODataBase(error.message);
         throw ioError;
      }
   }

   static async getUserSession(userID: string) {
      try {
         const accessToken = await redisClient.get(RedisKey.genKeyUserSession(userID));
         return accessToken;
      } catch (error: any) {
         const ioError = HttpErrors.IODataBase(error.message);
         throw ioError;
      }
   }

   static async setRegister(email: string, value: object, expireIn: number) {
      try {
         const key = RedisKey.genKeyRegister(email);
         const res = await redisClient.hmset(key, value);
         await redisClient.expire(key, expireIn);

         return res;
      } catch (error) {
         const ioError = HttpErrors.IODataBase(error.message);
         throw ioError;
      }
   }

   static async getRegisterData(email: string) {
      try {
         const key = RedisKey.genKeyRegister(email);
         const res = (await redisClient.hgetall(key)) as any;
         if (res && Object.keys(res).length > 0) {
            return res as IRegister;
         } else {
            return null;
         }
      } catch (error) {
         const ioError = HttpErrors.IODataBase(error.message);
         throw ioError;
      }
   }

   static async setResetPasswordData(userID: string, value: object, expireIn: number) {
      try {
         const key = RedisKey.genKeyResetPassword(userID);
         const res = await redisClient.hmset(key, value);
         await redisClient.expire(key, expireIn);

         return res;
      } catch (error) {
         const ioError = HttpErrors.IODataBase(error.message);
         throw ioError;
      }
   }

   static async getResetPasswordData(userID: string) {
      try {
         const key = RedisKey.genKeyResetPassword(userID);
         const res = (await redisClient.hgetall(key)) as any;
         if (res && Object.keys(res).length > 0) {
            return res as IResetPassword;
         } else {
            return null;
         }
      } catch (error) {
         const ioError = HttpErrors.IODataBase(error.message);
         throw ioError;
      }
   }
}

export default RedisLib;
