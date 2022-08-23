import { IMessage } from '../common/interfaces/models';
import Message from '../models/message.model';
import Group from '../models/group.model';

class ChatService {
   public async sendMessge(messagePayload: IMessage) {
      try {
         const { sender, to, content } = messagePayload;
      } catch (error) {
         throw error;
      }
   }
}

export default ChatService;
