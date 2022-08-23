import express from 'express';
import LinkConst from '../../common/const/link.const';
import AuthController from '../../controllers/auth.controller';
import AuthSchema from '../../libs/validate/auth.validate';
import ValidateMiddleware from '../../middlewares/validate.middleware';

const authRouter = express.Router();

const authCtrl = new AuthController();

authRouter.all(
   '/login',
   async (req, res, next) => {
      if (req.method === 'POST') {
         (req as any).pathShowErr = LinkConst.loginViewPath;
         ValidateMiddleware.validate({ bodySchema: AuthSchema.loginSchema })(req, res, next);
      } else {
         next();
      }
   },
   authCtrl.login
);

authRouter.get('/auth/google', authCtrl.googleAuth2);

authRouter.get('/auth/facebook', authCtrl.facebookAuth);

authRouter.all(
   '/register',
   async (req, res, next) => {
      if (req.method === 'POST') {
         (req as any).pathShowErr = LinkConst.viewRegisterPath;
         ValidateMiddleware.validate({ bodySchema: AuthSchema.registerSchema })(req, res, next);
      } else {
         next();
      }
   },
   authCtrl.register
);

authRouter.post(
   '/register/verify',
   async (req, res, next) => {
      (req as any).pathShowErr = LinkConst.viewVerifyAccountPath;
      ValidateMiddleware.validate({ bodySchema: AuthSchema.verifyAccountSchema })(req, res, next);
   },
   authCtrl.verifyAccount
);

authRouter.all(
   '/register/password',
   (req, res, next) => {
      if (req.method === 'POST') {
         (req as any).localOption = {
            data: {
               email: req.body.email,
            },
            info: null,
            errors: null,
         } as any;
         (req as any).pathShowErr = LinkConst.viewVerifyPasswordPath;

         ValidateMiddleware.validate({
            bodySchema: AuthSchema.completeRegisterSchema,
         })(req, res, next);
      } else {
         next();
      }
   },
   authCtrl.confirmPassword
);

authRouter.all(
   '/forgotPassword',
   (req, res, next) => {
      if (req.method === 'POST') {
         (req as any).pathShowErr = LinkConst.viewForgotPasswordPath;

         ValidateMiddleware.validate({
            bodySchema: AuthSchema.forgotPasswordSchema,
         })(req, res, next);
      } else {
         next();
      }
   },
   authCtrl.forgotPassword
);

authRouter.all(
   '/resetPassword',
   (req, res, next) => {
      if (req.method === 'POST') {
         (req as any).pathShowErr = LinkConst.viewResetPasswordPath;

         ValidateMiddleware.validate({
            bodySchema: AuthSchema.resetPasswordSchema,
         })(req, res, next);
      } else {
         next();
      }
   },
   authCtrl.resetPassword
);

export default authRouter;
