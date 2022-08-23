export default interface IRegister {
   otpSecret: string;
   otp: string;
   numberIncorrect: number;
   verified: boolean;
   token: string;
}
