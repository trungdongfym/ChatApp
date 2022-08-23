import User from '../models/user.model';
import Friend from '../models/friend.model';
import FriendWait from '../models/friendWait.model';
import mongoose, { FilterQuery } from 'mongoose';
import { IUser } from '../common/interfaces/models';

class UserService {
   public async listFriends(search?: string) {}

   public async listUsers(actor: IUser, search?: string) {
      try {
         const filterQuery: FilterQuery<IUser> = {
            _id: { $ne: new mongoose.Types.ObjectId(actor.id) },
         };

         if (search && search !== '') {
            filterQuery.$text = {
               $search: search,
            };
         }

         const users = await User.find(filterQuery, '_id fullname avatar', { lean: true });
         return users;
      } catch (error) {
         throw error;
      }
   }

   public async requestAddFriend(frendRequestID: string, actor: IUser) {
      try {
         const isFriend = await Friend.findOne({
            user: frendRequestID,
            friend: { $elemMatch: { $eq: actor.id } },
         });

         const isFriendWait = await FriendWait.findOne({
            user: frendRequestID,
            friendWait: { $elemMatch: { $eq: actor.id } },
         });

         console.log(isFriendWait);
         const result = await FriendWait.findOneAndUpdate(
            { user: frendRequestID, count: { $lte: 2 } },
            {
               $push: {
                  friendWait: actor.id,
               },
               $inc: { count: 1 },
               $setOnInsert: {
                  user: frendRequestID,
               },
            },
            {
               upsert: true,
               new: true,
            }
         );

         return result;
      } catch (error) {
         console.log(error);
         throw error;
      }
   }
}

export default UserService;
