export default interface IUserModel {
   id: string;
   email: string;
   fullname: string;
   provider: string;
   password: string;
   dateOfBirth: string | Date;
   avatar: string;
   phone: string;
   address: string;
   online: boolean;
   lastTimeOnline: Date | string;
}
