import AppConst from '../../common/const/app.const';
import * as bcypt from 'bcrypt';
import HttpErrors from '../error/httpErrors';

class BcyptLib {
   static async hashData(data: string) {
      try {
         const dataHashed = await bcypt.hash(data, AppConst.BCYPT_SALT_ROUND);
         return dataHashed;
      } catch (error: any) {
         const errorBcypt = HttpErrors.ServerError(error?.message);
         throw errorBcypt;
      }
   }

   static async compareData(dataCheck: string, dataHash: string) {
      try {
         const isEqual = await bcypt.compare(dataCheck, dataHash);
         return isEqual;
      } catch (error: any) {
         const errorBcypt = HttpErrors.ServerError(error?.message);
         throw errorBcypt;
      }
   }
}

export default BcyptLib;
