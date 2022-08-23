class AppConst {
   static readonly APP_ENV = {
      DEV: 'dev',
      PRODUCTION: 'production',
   };

   static readonly BCYPT_SALT_ROUND = 10;

   static readonly COOKIE_NAME_ACCESS_TOKEN = 'sid_accessToken';

   static readonly REGISTER_OTP_EXPIRE_TIME_SECONDS = 120; //2p

   static readonly VERIFY_OTP_EXPIRE_TIME_SECONDS = 1800; //30p

   static readonly URL_RESET_PASSWORD = 'http://localhost:5000/resetPassword';
}

export default AppConst;
