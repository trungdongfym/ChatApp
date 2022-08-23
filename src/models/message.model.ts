import mongoose from 'mongoose';
import AppObject from '../common/const/app.object';

const Schema = mongoose.Schema;

const messageSchema = new Schema(
   {
      sender: {
         type: mongoose.Types.ObjectId,
         require: true,
         ref: AppObject.Model_Name.USER,
      },
      to: {
         type: mongoose.Types.ObjectId,
         require: true,
         ref: AppObject.Model_Name.GROUP,
      },
      content: {
         type: String,
         required: true,
      },
      type: {
         type: String,
         required: true,
         enum: AppObject.MESSAGE_TYPE_ARRAY,
         default: AppObject.MESSAGE_TYPE_ENUM.TEXT,
      },
      sendTime: {
         type: Date,
         default: new Date(),
         require: true,
      },
      viewers: {
         type: Array,
         of: {
            _id: false,
            type: mongoose.Types.ObjectId,
            ref: AppObject.Model_Name.USER,
         },
         default: [],
      },
   },
   AppObject.SCHEMA_OPTIONS
);

const Message = mongoose.model(AppObject.Model_Name.MESSAGE, messageSchema);

export default Message;
