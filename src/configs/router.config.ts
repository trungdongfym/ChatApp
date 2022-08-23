import { Express } from 'express';
import { authRouter, messageRouter, userRouter } from '../routes';

function routerConfig(app: Express) {
   app.use('/', authRouter);
   app.use('/messages', messageRouter);
   app.use('/users', userRouter);
}

export default routerConfig;
