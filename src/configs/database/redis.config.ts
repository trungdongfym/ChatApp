import AppConfig from '../app.config';
import Redis, { RedisOptions } from 'ioredis';

const redisConfig = AppConfig.DATABASES.REDIS;

const redisOptions: RedisOptions = {
   host: redisConfig.HOST,
   port: redisConfig.PORT,
   db: redisConfig.DB,
};

if (redisConfig.USERNAME && redisConfig.PASSWORD) {
   redisOptions.username = redisConfig.USERNAME;
   redisOptions.password = redisConfig.PASSWORD;
}

const redisClient = new Redis(redisOptions);

async function redisConnect() {
   redisClient.on('connect', () => {
      redisClient.acl('WHOAMI').then((user) => {
         console.log(`Redis connected to user: ${user}`);
      });
   });

   redisClient.once('ready', () => {
      console.log('Redis ready!');
   });

   redisClient.once('error', (err) => {
      console.log('Redis connecte error:', err);
   });

   return redisClient;
}

export { redisConnect, redisClient };
