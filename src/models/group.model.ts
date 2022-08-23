import mongoose from 'mongoose';
import AppObject from '../common/const/app.object';

const Schema = mongoose.Schema;

const validateMember = function (value: Array<any>) {
   if (this.type === AppObject.GROUP_CHAT_TYPE_ENUM.TWO_PERSON_GROUP && value.length !== 2) {
      return false;
   }
   if (this.type === AppObject.GROUP_CHAT_TYPE_ENUM.MULTI_PERSON_GROUP && value.length <= 2) {
      return false;
   }
   return true;
};

const groupSchema = new Schema(
   {
      name: {
         type: String,
         require: true,
      },
      type: {
         type: String,
         enum: AppObject.GROUP_CHAT_TYPE_ARRAY,
         default: AppObject.GROUP_CHAT_TYPE_ENUM.TWO_PERSON_GROUP,
         require: true,
      },
      members: {
         type: Array,
         of: {
            _id: false,
            user: {
               type: mongoose.Types.ObjectId,
               unique: true,
               ref: AppObject.Model_Name.USER,
            },
            roles: {
               type: Array,
               of: {
                  type: String,
                  required: true,
                  enum: AppObject.ROLES_GROUP_CHAT_ARRAY,
                  default: AppObject.ROLES_GROUP_CHAT_ENUM.MEMBER,
               },
               minlength: 2,
               validate: function (value: Array<any>) {
                  const docParent = this.$parent();
                  if (
                     docParent.type === AppObject.GROUP_CHAT_TYPE_ENUM.TWO_PERSON_GROUP &&
                     !value.every((role: string) => role === AppObject.ROLES_GROUP_CHAT_ENUM.MEMBER)
                  ) {
                     return false;
                  }
                  return true;
               },
            },
         },
         validate: validateMember,
      },
   },
   AppObject.SCHEMA_OPTIONS
);

const Group = mongoose.model(AppObject.Model_Name.GROUP, groupSchema);

export default Group;
