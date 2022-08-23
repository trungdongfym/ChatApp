import { Request } from 'express';
import mongoose from 'mongoose';
import passportGoogle from 'passport-google-oauth20';
import passportJwt from 'passport-jwt';
import AppConst from '../../common/const/app.const';
import AppObject from '../../common/const/app.object';
import IUserPayload from '../../common/interfaces/userPayload';
import HttpErrors from '../../libs/error/httpErrors';
import User from '../../models/user.model';
import AppConfig from '../app.config';
import RedisLib from '../../libs/database/redis/redis.lib';
import passportFacebook from 'passport-facebook';
import passportLocal from 'passport-local';

class AuthStrategy {
   static googleAuth2Strategy() {
      return new passportGoogle.Strategy(
         {
            clientID: AppConfig.OAUTH2.CLIENT_ID,
            clientSecret: AppConfig.OAUTH2.CLIENT_SECRET,
            callbackURL: AppConfig.OAUTH2.REDIRECT_URI,
         },
         async function (accessToken: string, refreshToken: string, profile, done) {
            const userProfile = profile._json;
            const email = userProfile.email;

            try {
               const user = await User.findOne({ email: email });
               // If user not exists, add user to db
               if (!user) {
                  const newUser = new User({
                     email: userProfile.email,
                     fullname: userProfile.name,
                     avatar: userProfile.picture,
                     provider: AppObject.PROVIDER_ENUM.GOOGLE,
                  });

                  const userSaved = await newUser.save();

                  return done(null, userSaved.toJSON());
               } else {
                  if (user.provider !== AppObject.PROVIDER_ENUM.GOOGLE) {
                     user.provider = AppObject.PROVIDER_ENUM.GOOGLE;
                     user.avatar = userProfile.picture;
                     await user.save();
                  }

                  return done(null, user.toJSON());
               }
            } catch (error: any) {
               const errorIO = HttpErrors.IODataBase(error?.message);
               return done(errorIO, undefined);
            }
         }
      );
   }

   static facebookStrategy() {
      return new passportFacebook.Strategy(
         {
            clientID: AppConfig.FACEBOOK.CLIENT_ID,
            clientSecret: AppConfig.FACEBOOK.CLIENT_SECRET,
            callbackURL: AppConfig.FACEBOOK.REDIRECT_URI,
            profileFields: ['id', 'displayName', 'photos', 'email'],
         },
         async function (accessToken: string, refreshToken: string, profile, done) {
            const userProfile = profile._json;
            const email = userProfile.email;

            try {
               const user = await User.findOne({ email: email });
               // If user not exists, add user to db
               if (!user) {
                  const newUser = new User({
                     email: userProfile.email,
                     fullname: userProfile.name,
                     avatar: userProfile.picture?.data?.url,
                     provider: AppObject.PROVIDER_ENUM.FACEBOOK,
                  });

                  const userSaved = await newUser.save();

                  return done(null, userSaved.toJSON());
               } else {
                  if (user.provider !== AppObject.PROVIDER_ENUM.FACEBOOK) {
                     user.provider = AppObject.PROVIDER_ENUM.FACEBOOK;
                     user.avatar = userProfile.picture?.data?.url;
                     await user.save();
                  }

                  return done(null, user.toJSON());
               }
            } catch (error: any) {
               const errorIO = HttpErrors.IODataBase(error?.message);
               return done(errorIO, undefined);
            }
         }
      );
   }

   static localStrategy() {
      return new passportLocal.Strategy(
         { usernameField: 'email', passwordField: 'password' },
         async function (email, password, done) {
            try {
               const user = await User.findOne({ email: email });

               const notFound = HttpErrors.NotFound('Tài khoản hoặc mật khẩu không chính xác!');
               if (!user) {
                  return done(notFound, null);
               }

               const isPasswordMatch = await (user as any).comparePassword(password);
               if (isPasswordMatch) {
                  return done(null, user.toJSON());
               } else {
                  return done(notFound, null);
               }
            } catch (error: any) {
               const err = HttpErrors.IODataBase(error?.message);
               return done(err, null);
            }
         }
      );
   }

   static jwtAuthStrategy() {
      function customExtract(req: Request) {
         let token = null;
         if (req && req.signedCookies) {
            token = req.signedCookies[AppConst.COOKIE_NAME_ACCESS_TOKEN];
         }
         return token;
      }

      return new passportJwt.Strategy(
         {
            passReqToCallback: true,
            secretOrKey: AppConfig.AUTH.ACCESS_TOKEN_SECRET,
            jwtFromRequest: customExtract,
         },
         async function (req: Request, tokenPayload: IUserPayload, done: any) {
            try {
               const user = await User.findOne({
                  _id: new mongoose.Types.ObjectId(tokenPayload.id),
               });

               const tokenInvalid = HttpErrors.InvalidToken('Token invalid!');

               if (user) {
                  const realAccessToken = await RedisLib.getUserSession(user.id);

                  if (!realAccessToken === req.signedCookies[AppConst.COOKIE_NAME_ACCESS_TOKEN]) {
                     return done(tokenInvalid, false);
                  }

                  return done(null, user.toJSON());
               } else {
                  return done(tokenInvalid, false);
               }
            } catch (error: any) {
               const err = HttpErrors.ServerError(error?.message);
               done(err, false);
            }
         }
      );
   }
}

export default AuthStrategy;
