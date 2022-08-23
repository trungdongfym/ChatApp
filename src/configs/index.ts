import AppConfig from './app.config';
import middlewareConfig from './middleware.config';
import routerConfig from './router.config';
import { databaseConfig, redisClient } from './database';
import { passportConfig } from './auth';
import { sendMail } from './notification/sendMail';
import { socketIO, socketIOConfig } from './socket';

export {
   AppConfig,
   middlewareConfig,
   routerConfig,
   databaseConfig,
   passportConfig,
   sendMail,
   socketIOConfig,
   socketIO,
   redisClient,
};
