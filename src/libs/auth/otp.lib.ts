import { totp, hotp } from 'otplib';
import { AppConfig } from '../../configs';

class OtpLib {
   static generateOtp(secretKey: string) {
      totp.options = {
         algorithm: AppConfig.OTP.ALGORITHM as any,
         epoch: 0,
      };

      return totp.generate(secretKey);
   }

   static verify(otp: string, secretKey: string) {
      totp.options = {
         algorithm: AppConfig.OTP.ALGORITHM as any,
         epoch: 0,
      };

      return totp.verify({ token: otp, secret: secretKey });
   }
}

export default OtpLib;
