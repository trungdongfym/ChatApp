import { redisClient, redisConnect } from './redis.config';
import mongoConnect from './mongo.config';
async function databaseConfig() {
   mongoConnect();
   await redisConnect();
}

export { databaseConfig, redisClient };
