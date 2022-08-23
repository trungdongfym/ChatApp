import { Express } from 'express';
import passport from 'passport';
import AppConfig from '../app.config';
import AuthStrategy from './authStrategy';

function passportConfig(app: Express) {
   const authConfig = AppConfig.AUTH;

   app.use(passport.initialize());
   // Register auth strategy
   passport.use(AuthStrategy.jwtAuthStrategy());
   passport.use(AuthStrategy.googleAuth2Strategy());
   passport.use(AuthStrategy.facebookStrategy());
   passport.use(AuthStrategy.localStrategy());
   //End register auth strategy
}

export default passportConfig;
