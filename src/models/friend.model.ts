import mongoose from 'mongoose';
import AppObject from '../common/const/app.object';

const Schema = mongoose.Schema;

const friendSchema = new Schema(
   {
      user: {
         type: mongoose.Types.ObjectId,
         require: true,
      },
      friend: [
         {
            type: mongoose.Types.ObjectId,
            require: true,
            _id: false,
         },
      ],
   },
   AppObject.SCHEMA_OPTIONS
);

const Friend = mongoose.model(AppObject.Model_Name.FRIEND, friendSchema);

export default Friend;
