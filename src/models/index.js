// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AttachmentType = {
  "IMAGE": "IMAGE",
  "VIDEO": "VIDEO"
};

const { Attachment, Message, ChatRoom, User, UserChatRoom } = initSchema(schema);

export {
  Attachment,
  Message,
  ChatRoom,
  User,
  UserChatRoom,
  AttachmentType
};