import { IUser } from '../common/interfaces/models';
import IUserPayload from '../common/interfaces/userPayload';
import { AppConfig } from '../configs';
import { pickField } from '../utils/object.util';
import RedisLib from '../libs/database/redis/redis.lib';
import TokenLib from '../libs/auth/token.lib';
import HttpErrors from '../libs/error/httpErrors';
import User from '../models/user.model';
import { sendMail } from '../configs';
import { ISendMail } from '../common/interfaces/sendMail';
import IRegister from '../common/interfaces/register';
import mongoose from 'mongoose';
import OtpLib from '../libs/auth/otp.lib';
import RedisKey from '../libs/database/redis/redisKey';
import IResetPassword from '../common/interfaces/resetPassword';
import AppConst from '../common/const/app.const';
import AppObject from '../common/const/app.object';

class AuthService {
   public async login(user: IUser) {
      const tokenPayloadField = AppConfig.AUTH.TOKEN_FIELD_PAYLOAD;
      const userPayload: IUserPayload = pickField(user, tokenPayloadField) as any;

      try {
         const oldAccessToken = await RedisLib.getUserSession(user.id);

         const accessToken = oldAccessToken
            ? oldAccessToken
            : TokenLib.signToken('ACESS_TOKEN', userPayload);

         // Save token to redis
         const res = await RedisLib.addUserSession(user.id, accessToken);
         if (res !== 'OK' && !oldAccessToken) {
            throw HttpErrors.IODataBase('Unable save token!');
         }

         return accessToken;
      } catch (error) {
         throw error;
      }
   }

   public async register(email: string, expireIn: number, reRegister?: boolean) {
      try {
         const userExist = await User.findOne({ email: email });

         if (userExist) {
            throw HttpErrors.Conflict('Email đã tồn tại!');
         }

         let registerDataOld: Partial<IRegister> = {};
         if (reRegister) {
            registerDataOld = await RedisLib.getRegisterData(email);
         }

         const otpSecret = new mongoose.Types.ObjectId().toString();

         const registerData: IRegister = {
            otpSecret: otpSecret,
            numberIncorrect: registerDataOld.numberIncorrect ?? 0,
            token: null,
            verified: false,
            otp: OtpLib.generateOtp(otpSecret),
         };

         const res = await RedisLib.setRegister(email, registerData, expireIn);

         if (res === 'OK' && false) {
            const sendMailPayload: ISendMail = {
               from: 'App Chat',
               subject: 'Xác thực tài khoản app chat',
               to: [email],
               text: `Mã xác nhận tài khoản của bạn là: ${registerData.otp}`,
            };
            await sendMail(sendMailPayload);
         }

         return res;
      } catch (error) {
         throw error;
      }
   }

   public async verifyAccount(email: string, otp: string, expireIn: number) {
      try {
         const registerDataOld = await RedisLib.getRegisterData(email);

         if (!registerDataOld) {
            throw HttpErrors.BadRequest('OTP không chính xác!');
         }

         if ((registerDataOld.verified as any) === 'true') {
            throw HttpErrors.BadRequest('Tài khoản đã được xác thực!');
         }
         // Verify otp
         if (otp === registerDataOld.otp || OtpLib.verify(otp, registerDataOld.otpSecret)) {
            const registerData: IRegister = {
               ...registerDataOld,
               verified: true,
               token: TokenLib.signToken('OTP_TOKEN', { email: email }),
            };

            await RedisLib.setRegister(email, registerData, expireIn);

            return registerData;
         } else {
            await RedisLib.getClient().hincrby(
               RedisKey.genKeyRegister(email),
               'numberIncorrect',
               1
            );
         }

         return null;
      } catch (error) {
         throw error;
      }
   }

   public async createUser(
      userAccount: { email: string; password: string; fullname: string },
      tokenVerify: string
   ) {
      try {
         const accountPayload = TokenLib.verifyToken('OTP_TOKEN', tokenVerify);

         const { email } = accountPayload;

         const registerData = await RedisLib.getRegisterData(email);

         if (registerData.token !== tokenVerify || (registerData as any).verified !== 'true') {
            throw HttpErrors.InvalidToken('Email chưa được xác nhận!');
         }

         const newUser = new User(userAccount);
         const userCreated = (await newUser.save()).toJSON();

         if (userCreated) {
            await RedisLib.getClient().del(RedisKey.genKeyRegister(email));
         }

         return userCreated;
      } catch (error) {
         throw error;
      }
   }
   /**
    *
    * @param email Email need reset passwrod
    * @param tokenReset If you already have a token, you can reset your password
    * @note Only pass parameter tokenReset when user have token
    * @return alreadyReset = true -> already reset password
    * verified = true -> reset password token is reset
    */
   public async resetPassword(email: string, resetData?: { tokenReset: string; password: string }) {
      try {
         const resultReset = {
            alreadyReset: false,
            reseted: false,
         };

         if (email && !resetData) {
            const user = await User.findOne({ email: email });
            if (!user || user.provider !== AppObject.PROVIDER_ENUM.LOCAL) {
               throw HttpErrors.NotFound('Email không tồn tại!');
            }

            const resetTokenPayload = {
               id: user.id,
               email: user.email,
            };

            const resetToken = TokenLib.signToken('RESET_TOKEN', resetTokenPayload);

            const resetCacheData: IResetPassword = {
               email: user.email,
               token: resetToken,
            };
            const expireTime = AppConfig.RESET_PASSWORD.EXPIRE_TIME_SECONDS;

            const result = await RedisLib.setResetPasswordData(user.id, resetCacheData, expireTime);

            if (result === 'OK') {
               resultReset.alreadyReset = true;

               const sendMailPayload: ISendMail = {
                  from: 'App Chat',
                  subject: 'Khôi phục mật khẩu app chat',
                  to: [email],
                  html: `
                     <h3>Khôi phục mật khẩu app chat</h3>
                     <p>Hãy theo đường dẫn phía dưới để khôi phục mật khẩu</p>
                     <a href="${AppConst.URL_RESET_PASSWORD}/?token=${resetToken}">Khôi phục mật khẩu</a>
                  `,
               };
               await sendMail(sendMailPayload);
            }
         }

         if (resetData) {
            const { password, tokenReset } = resetData;

            const resetTokenPayload = TokenLib.verifyToken('RESET_TOKEN', tokenReset);

            const { id: userID, email } = resetTokenPayload;

            const resetCacheData = await RedisLib.getResetPasswordData(userID);

            if (
               !resetData ||
               resetCacheData.token !== tokenReset ||
               resetCacheData.email !== email
            ) {
               throw HttpErrors.InvalidToken('Token invalid!');
            }

            const user = await User.findById(userID);
            if (!user) {
               throw HttpErrors.NotFound('Email không tồn tại!');
            }

            // reset password
            user.password = password;
            const result = await user.save();
            if (result) {
               await RedisLib.getClient().del(RedisKey.genKeyResetPassword(userID));
               resultReset.reseted = true;
            }
         }

         return resultReset;
      } catch (error) {
         throw error;
      }
   }
}

export default AuthService;
