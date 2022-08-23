import Joi from 'joi';

class AuthSchema {
   static loginSchema = Joi.object().keys({
      email: Joi.string()
         .email({ tlds: { allow: false } })
         .error(new Error('Email không hợp lệ!'))
         .required(),
      password: Joi.string().required().error(new Error('Mật khẩu không được trống!')),
      remember: Joi.any().allow('on'),
   });

   static registerSchema = Joi.object().keys({
      email: Joi.string()
         .email({ tlds: { allow: false } })
         .error(new Error('Email không hợp lệ!'))
         .required()
         .error(new Error('Email không được bỏ trống!')),
   });

   static verifyAccountSchema = Joi.object().keys({
      otp: Joi.string()
         .regex(/^\d{6}$/)
         .error(new Error('OTP không hợp lệ!'))
         .required(),
   });

   static completeRegisterSchema = Joi.object()
      .keys({
         email: Joi.string()
            .email({ tlds: { allow: false } })
            .required(),
         fullname: Joi.string().required(),
         password: Joi.string().required(),
         confirmPassword: Joi.ref('password'),
      })
      .error((errors: Joi.ErrorReport[]): string | Error | Joi.ValidationErrorItem => {
         errors.forEach((err) => {
            if (err.code === 'string.empty') {
               err.message = `${(err as any).local.label} không được bỏ trống!`;
            }

            if (err.code === 'any.only') {
               err.message = 'Mật khẩu không giống mật khẩu xác nhận!';
            }
         });
         return errors as any;
      });

   static forgotPasswordSchema = Joi.object().keys({
      email: Joi.string()
         .email({ tlds: { allow: false } })
         .required()
         .error(new Error('Email không hợp lệ!')),
   });

   static resetPasswordSchema = Joi.object()
      .keys({
         password: Joi.string().required(),
         confirmPassword: Joi.ref('password'),
      })
      .error((errors: Joi.ErrorReport[]): string | Error | Joi.ValidationErrorItem => {
         errors.forEach((err) => {
            if (err.code === 'string.empty') {
               err.message = `${(err as any).local.label} không được bỏ trống!`;
            }

            if (err.code === 'any.only') {
               err.message = 'Mật khẩu không giống mật khẩu xác nhận!';
            }
         });
         return errors as any;
      });
}

export default AuthSchema;
