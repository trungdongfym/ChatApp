import * as path from 'path';
import AppConst from '../common/const/app.const';
import { IAppEnv } from '../common/interfaces/appEnv';

process.env['NODE_CONFIG_DIR'] = path.join(__dirname, 'env');
import config from 'config';

function getEnv() {
   const mode = process.env.NODE_ENV;
   const AppEnvConst = AppConst.APP_ENV;
   let appConfig = null;
   switch (mode) {
      case AppEnvConst.DEV:
         appConfig = config.get(AppEnvConst.DEV);
         break;
      case AppEnvConst.PRODUCTION:
         appConfig = config.get(AppEnvConst.PRODUCTION);
         break;
      default:
         appConfig = config.get(AppEnvConst.DEV);
         break;
   }
   return appConfig;
}

const AppConfig = getEnv() as IAppEnv;

export default AppConfig;
