export interface IAppEnv {
   PORT: number;
   OAUTH2: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
   };
   DATABASES: {
      REDIS: {
         HOST: string;
         PORT: number;
         DB: number;
         USERNAME: string;
         PASSWORD: string;
      };
      MONGO: {
         HOST: string;
         PORT: string;
         DATABASE_NAME: string;
      };
   };
   AUTH: {
      SESSION_SECRET: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRE_SECONDS: number;
      REFRESH_TOKEN_EXPIRE_SECONDS: number;
      TOKEN_FIELD_PAYLOAD: Array<string>;
      OTP_TOKEN_SECRET: string;
   };
   FACEBOOK: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
   };
   SEND_MAIL: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REFRESH_TOKEN: string;
      REDIRECT_URI: string;
      SERVICE: string;
      USER: string;
   };
   OTP: {
      ALGORITHM: string;
      NUM_INCORRECT_VALID: number;
   };
   RESET_PASSWORD: {
      RESET_TOKEN_SECRET: string;
      EXPIRE_TIME_SECONDS: number;
   };
}
