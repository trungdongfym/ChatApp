import mongoose from 'mongoose';
import AppObject from '../common/const/app.object';
import { IUser } from '../common/interfaces/models';
import BcyptLib from '../libs/auth/bscypt.lib';
import { checkType } from '../utils/type.util';

const Schema = mongoose.Schema;

const userSchema = new Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
         set: function (email: string) {
            return email.toLowerCase();
         },
      },
      provider: {
         type: String,
         enum: AppObject.PROVIDER_ARRAY,
         require: true,
         default: AppObject.PROVIDER_ENUM.LOCAL,
      },
      password: {
         type: String,
         required: function () {
            (this as any).provider === AppObject.PROVIDER_ENUM.LOCAL ? true : false;
         },
      },
      fullname: {
         type: String,
         required: true,
      },
      dateOfBirth: {
         type: Date,
      },
      avatar: {
         type: String,
      },
      phone: {
         type: String,
      },
      address: {
         type: String,
      },
      online: {
         type: Boolean,
         require: true,
         default: false,
      },
      lastTimeOnline: {
         type: Date,
         require: true,
         default: Date.now(),
      },
   },
   AppObject.SCHEMA_OPTIONS
);

userSchema.index({ fullname: 'text' });

userSchema.pre('save', async function (next) {
   if (!this.password || this.password === '' || !this.isModified('password')) return next();
   if (this.password) {
      this.password = await BcyptLib.hashData(this.password);
   }
   next();
});

userSchema.methods.comparePassword = function (
   passwordCompare: string,
   cb?: (err: any, isEqual: boolean | null) => void
) {
   return new Promise((resolve, reject) => {
      if (!this.password) {
         const err = new Error('Tài khoản hoặc mật khẩu không chính xác!');
         if (cb && checkType(cb) === 'Function') {
            cb(err, null);
         }
         reject(err);
      }
      BcyptLib.compareData(passwordCompare, this.password)
         .then((isEqual) => {
            if (cb && checkType(cb) === 'Function') {
               cb(null, isEqual);
            }
            resolve(isEqual);
         })
         .catch((err) => {
            if (cb && checkType(cb) === 'Function') {
               cb(err, null);
            }
            reject(err);
         });
   });
};

const User = mongoose.model(AppObject.Model_Name.USER, userSchema);

export default User;
