import compression from 'compression';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response, Errback } from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import AppConfig from './app.config';
import bodyParser from 'body-parser';

function middlewareConfig(app: Express) {
   app.use(cors());
   app.use(
      compression({
         threshold: 100 * 1024,
         filter: (req, res) => {
            if (req.headers['x-no-compression']) {
               return false;
            }
            return compression.filter(req, res);
         },
      })
   );
   // View engine config
   app.set('views', path.resolve(__dirname, '../views'));
   app.set('view engine', 'ejs');
   app.engine('ejs', require('ejs-locals'));
   // End view engine config

   app.use(cookieParser(AppConfig.AUTH.SESSION_SECRET));
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));
   app.use(express.static(path.resolve(__dirname, '../../public')));

   setImmediate(() => {
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
         const pathViewErr = (req as any).pathShowErr;
         const localOption = (req as any).localOption ?? { data: null, errors: null, info: null };

         if (pathViewErr) {
            localOption.errors = err.message;
            res.render(pathViewErr, localOption);
         } else {
            res.json(err);
         }
      });
   });
}

export default middlewareConfig;
