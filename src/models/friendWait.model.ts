import mongoose from 'mongoose';
import AppObject from '../common/const/app.object';

const Schema = mongoose.Schema;

const friendWaitSchema = new Schema(
   {
      user: {
         type: mongoose.Types.ObjectId,
         ref: AppObject.Model_Name.USER,
         require: true,
      },
      friendWait: [
         {
            type: mongoose.Types.ObjectId,
            ref: AppObject.Model_Name.USER,
            require: true,
         },
      ],
      count: {
         type: Number,
         require: true,
         default: 1,
      },
   },
   AppObject.SCHEMA_OPTIONS
);

const FriendWait = mongoose.model(AppObject.Model_Name.FRIEND_WAIT, friendWaitSchema);

export default FriendWait;
