import { CookieOptions, NextFunction, Request, Response } from 'express';
import passport from 'passport';
import AppConst from '../common/const/app.const';
import AppObject from '../common/const/app.object';
import LinkConst from '../common/const/link.const';
import TokenLib from '../libs/auth/token.lib';
import HttpErrors from '../libs/error/httpErrors';
import AuthService from '../services/auth.service';

const authService = new AuthService();

class AuthController {
   public login(req: Request, res: Response, next: NextFunction) {
      const viewLoginPath = LinkConst.loginViewPath;
      const localOption = { data: null, errors: null, info: null };

      const { provider } = req.query;

      if (provider === AppObject.PROVIDER_ENUM.GOOGLE) {
         passport.authenticate('google', {
            scope: ['profile', 'email'],
         })(req, res);
         return;
      }

      if (provider === AppObject.PROVIDER_ENUM.FACEBOOK) {
         passport.authenticate('facebook', { scope: ['email', 'public_profile'] })(req, res, next);
         return;
      }

      if (provider === AppObject.PROVIDER_ENUM.LOCAL) {
         passport.authenticate('local', { session: false }, async (err, user) => {
            try {
               if (err) {
                  throw err;
               }

               if (!user) {
                  throw HttpErrors.NotFound('Tài khoản hoặc mật khẩu không chính xác!');
               }

               const accessToken = await authService.login(user);
               const tokenPayload = TokenLib.decodeToken(accessToken);

               const { remember } = req.body;

               const cookieOption: CookieOptions = {
                  signed: true,
                  httpOnly: true,
                  sameSite: 'lax',
                  secure: false,
               };
               // Change to cookie expire
               if (remember === 'on') {
                  cookieOption.expires = new Date(tokenPayload.exp * 1000);
               }
               // assign token to cookie
               res.cookie(AppConst.COOKIE_NAME_ACCESS_TOKEN, accessToken, cookieOption);

               res.redirect('/messages');
            } catch (error) {
               localOption.errors = (error as HttpErrors).message as any;
               res.render(viewLoginPath, localOption);
               return;
            }
         })(req, res, next);
         return;
      }
      // If method is get and no provider
      res.render(viewLoginPath, localOption);
   }

   public googleAuth2(req: Request, res: Response) {
      passport.authenticate('google', { session: false }, async (err, user) => {
         if (err) {
            res.redirect('/login');
            return;
         }

         try {
            if (!user) {
               throw HttpErrors.NotFound('User not exists!');
            }
            const accessToken = await authService.login(user);
            const tokenPayload = TokenLib.decodeToken(accessToken);
            // assign token to cookie
            res.cookie(AppConst.COOKIE_NAME_ACCESS_TOKEN, accessToken, {
               signed: true,
               expires: new Date(tokenPayload.exp * 1000),
               httpOnly: true,
               sameSite: 'lax',
               secure: false,
            });

            res.redirect('/messages');
         } catch (error) {
            res.redirect('/login');
         }
      })(req, res);
   }

   public facebookAuth(req: Request, res: Response) {
      passport.authenticate('facebook', { session: false }, async (err, user) => {
         if (err) {
            res.redirect('/login');
            return;
         }

         try {
            if (!user) {
               throw HttpErrors.NotFound('User not exists!');
            }

            const accessToken = await authService.login(user);
            const tokenPayload = TokenLib.decodeToken(accessToken);
            // assign token to cookie
            res.cookie(AppConst.COOKIE_NAME_ACCESS_TOKEN, accessToken, {
               signed: true,
               expires: new Date(tokenPayload.exp * 1000),
               httpOnly: true,
               sameSite: 'lax',
               secure: false,
            });

            res.redirect('/messages');
         } catch (error) {
            res.redirect('/login');
         }
      })(req, res);
   }

   public async register(req: Request, res: Response) {
      const viewRegisterPath = LinkConst.viewRegisterPath;
      const viewVerifyPath = LinkConst.viewVerifyAccountPath;
      let viewPathError = viewRegisterPath;
      const localOption = { data: null, errors: null, info: null };

      try {
         const query = req.query;
         if (req.method === 'GET' && !query.resendOtp) {
            res.render(viewRegisterPath, localOption);
            return;
         }

         if (req.method === 'GET' && query.resendOtp) {
            const { register_email } = req.signedCookies;
            try {
               if (!register_email) {
                  throw HttpErrors.BadRequest('Không tìm thấy email đăng ký!');
               }
               const expireTimeOtp = AppConst.REGISTER_OTP_EXPIRE_TIME_SECONDS;

               const result = await authService.register(register_email, expireTimeOtp, true);

               if (result !== 'OK') {
                  throw HttpErrors.ServerError('Lỗi không xác định!');
               }

               localOption.data = {} as any;
               (localOption.data as any).expireIn = expireTimeOtp;
               localOption.info = 'Mã xác nhận đã được gửi lại, vui lòng kiểm tra hòm thư';

               res.render(viewVerifyPath, localOption);
            } catch (error) {
               viewPathError = viewVerifyPath;
               throw error;
            }
            return;
         }

         if (req.method === 'POST') {
            const { email } = req.body;
            const expireTimeOtp = AppConst.REGISTER_OTP_EXPIRE_TIME_SECONDS;

            const result = await authService.register(email, expireTimeOtp);

            if (result !== 'OK') {
               throw HttpErrors.ServerError('Lỗi không xác định!');
            }

            localOption.data = {} as any;
            (localOption.data as any).expireIn = expireTimeOtp;

            // Cache email register
            res.cookie('register_email', email, {
               signed: true,
               httpOnly: true,
               path: '/register',
               sameSite: 'lax',
            });

            res.render(viewVerifyPath, localOption);
            return;
         }
      } catch (error) {
         localOption.errors = (error as HttpErrors).message as any;
         res.render(viewPathError, localOption);
         return;
      }
   }

   public async verifyAccount(req: Request, res: Response) {
      const viewVerifyPath = LinkConst.viewVerifyAccountPath;
      let viewPathError = viewVerifyPath;
      const localOption = { data: null, errors: null, info: null };

      try {
         const { otp } = req.body;
         const { register_email } = req.signedCookies;
         if (!register_email) {
            throw HttpErrors.BadRequest('Không tìm thấy email đăng ký!');
         }
         const expireTimeVerify = AppConst.VERIFY_OTP_EXPIRE_TIME_SECONDS;
         const verifyPayload = await authService.verifyAccount(
            register_email,
            otp,
            expireTimeVerify
         );

         if (!verifyPayload) {
            throw HttpErrors.InvalidToken('Mã OTP không chính xác!');
         }

         res.cookie('verify_account_token', verifyPayload.token, {
            signed: true,
            httpOnly: true,
            maxAge: expireTimeVerify * 1000,
            sameSite: 'lax',
            secure: false,
            path: '/register/password',
         });

         res.redirect('/register/password');
      } catch (error) {
         localOption.errors = (error as HttpErrors).message as any;
         res.render(viewPathError, localOption);
         return;
      }
   }

   public async confirmPassword(req: Request, res: Response) {
      const pathView = LinkConst.viewVerifyPasswordPath;
      let pathViewErr = pathView;

      const { verify_account_token, register_email } = req.signedCookies;
      const localOption = {
         data: {
            email: register_email,
         },
         errors: null,
         info: null,
      };

      try {
         if (!verify_account_token || !register_email) {
            pathViewErr = LinkConst.viewRegisterPath;
            throw HttpErrors.InvalidToken('Chưa xác nhận tài khoản!');
         }

         if (req.method === 'GET') {
            res.render(pathView, localOption);
         }

         if (req.method === 'POST') {
            const { email, password, fullname } = req.body;
            const result = await authService.createUser(
               { email, password, fullname },
               verify_account_token
            );

            if (!result) {
               throw HttpErrors.IODataBase('Không thể tạo người dùng!');
            }

            res.clearCookie('verify_account_token').clearCookie('register_email');
            res.redirect('/login');
         }
      } catch (error) {
         localOption.errors = (error as HttpErrors).message as any;
         res.render(pathViewErr, localOption);
         return;
      }
   }

   public async forgotPassword(req: Request, res: Response) {
      const pathView = LinkConst.viewForgotPasswordPath;
      let pathViewErr = pathView;
      const localOption = {
         data: null,
         errors: null,
         info: null,
      };

      try {
         if (req.method === 'GET') {
            res.render(pathView, localOption);
            return;
         }

         if (req.method === 'POST') {
            const { email } = req.body;

            const { alreadyReset } = await authService.resetPassword(email);
            if (alreadyReset) {
               localOption.info = 'Hãy kiểm tra hòm thư email của bạn để lấy lại mật khẩu!';
               res.render(pathView, localOption);
            }
            return;
         }
      } catch (error) {
         localOption.errors = (error as HttpErrors).message as any;
         res.render(pathViewErr, localOption);
         return;
      }
   }

   public async resetPassword(req: Request, res: Response) {
      const pathViewResetPassword = LinkConst.viewResetPasswordPath;
      const pathViewLogin = LinkConst.loginViewPath;
      let pathViewErr = pathViewResetPassword;
      const localOption = {
         data: null,
         errors: null,
         info: null,
      };

      try {
         const { token } = req.query;

         if (req.method === 'GET') {
            if (token) {
               localOption.data = {};
               localOption.data['token'] = token;
               res.render(pathViewResetPassword, localOption);
            } else {
               pathViewErr = pathViewLogin;
               throw HttpErrors.BadRequest('Đường dẫn không hợp lệ!');
            }
            return;
         }

         if (req.method === 'POST') {
            if (token) {
               const { password } = req.body;

               const { reseted } = await authService.resetPassword(null, {
                  tokenReset: token as string,
                  password: password,
               });

               if (reseted) {
                  localOption.info = 'Khôi phục mật khẩu thành công!';
               } else {
                  localOption.info = 'Lỗi không xác định, khôi phục mật khẩu thành công!';
               }
               res.render(pathViewLogin, localOption);
            } else {
               pathViewErr = pathViewResetPassword;
               throw HttpErrors.BadRequest('Lỗi không có token!');
            }
            return;
         }
      } catch (error) {
         localOption.errors = (error as HttpErrors).message as any;
         res.render(pathViewErr, localOption);
         return;
      }
   }
}

export default AuthController;
