import mongoose from 'mongoose';
import AppConfig from '../app.config';

function mongoConnect() {
   const mongoConfig = AppConfig.DATABASES.MONGO;
   const uri = `mongodb://${mongoConfig.HOST}:${mongoConfig.PORT}`;
   mongoose.connect(uri, {
      dbName: mongoConfig.DATABASE_NAME,
   });

   mongoose.connection.once('open', () => {
      console.log(`Mongo connected!`);
   });

   mongoose.connection.once('error', (err) => {
      console.log(`mongo connect error::`, err);
   });
}

export default mongoConnect;
