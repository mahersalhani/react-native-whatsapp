import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO"
}



type EagerAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Attachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly storageKey: string;
  readonly type: AttachmentType | keyof typeof AttachmentType;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly duration?: number | null;
  readonly messageID: string;
  readonly chatroomID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Attachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly storageKey: string;
  readonly type: AttachmentType | keyof typeof AttachmentType;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly duration?: number | null;
  readonly messageID: string;
  readonly chatroomID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Attachment = LazyLoading extends LazyLoadingDisabled ? EagerAttachment : LazyAttachment

export declare const Attachment: (new (init: ModelInit<Attachment>) => Attachment) & {
  copyOf(source: Attachment, mutator: (draft: MutableModel<Attachment>) => MutableModel<Attachment> | void): Attachment;
}

type EagerMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly createdAt: string;
  readonly text: string;
  readonly chatroomID: string;
  readonly userID: string;
  readonly images?: (string | null)[] | null;
  readonly Attachments?: (Attachment | null)[] | null;
  readonly updatedAt?: string | null;
}

type LazyMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly createdAt: string;
  readonly text: string;
  readonly chatroomID: string;
  readonly userID: string;
  readonly images?: (string | null)[] | null;
  readonly Attachments: AsyncCollection<Attachment>;
  readonly updatedAt?: string | null;
}

export declare type Message = LazyLoading extends LazyLoadingDisabled ? EagerMessage : LazyMessage

export declare const Message: (new (init: ModelInit<Message>) => Message) & {
  copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}

type EagerChatRoom = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChatRoom, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly image?: string | null;
  readonly Messages?: (Message | null)[] | null;
  readonly users?: (UserChatRoom | null)[] | null;
  readonly LastMessage?: Message | null;
  readonly Attachments?: (Attachment | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chatRoomLastMessageId?: string | null;
}

type LazyChatRoom = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChatRoom, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly image?: string | null;
  readonly Messages: AsyncCollection<Message>;
  readonly users: AsyncCollection<UserChatRoom>;
  readonly LastMessage: AsyncItem<Message | undefined>;
  readonly Attachments: AsyncCollection<Attachment>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chatRoomLastMessageId?: string | null;
}

export declare type ChatRoom = LazyLoading extends LazyLoadingDisabled ? EagerChatRoom : LazyChatRoom

export declare const ChatRoom: (new (init: ModelInit<ChatRoom>) => ChatRoom) & {
  copyOf(source: ChatRoom, mutator: (draft: MutableModel<ChatRoom>) => MutableModel<ChatRoom> | void): ChatRoom;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly status?: string | null;
  readonly image?: string | null;
  readonly Messages?: (Message | null)[] | null;
  readonly ChatRooms?: (UserChatRoom | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly status?: string | null;
  readonly image?: string | null;
  readonly Messages: AsyncCollection<Message>;
  readonly ChatRooms: AsyncCollection<UserChatRoom>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerUserChatRoom = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserChatRoom, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly chatRoomId?: string | null;
  readonly userId?: string | null;
  readonly chatRoom: ChatRoom;
  readonly user: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserChatRoom = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserChatRoom, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly chatRoomId?: string | null;
  readonly userId?: string | null;
  readonly chatRoom: AsyncItem<ChatRoom>;
  readonly user: AsyncItem<User>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserChatRoom = LazyLoading extends LazyLoadingDisabled ? EagerUserChatRoom : LazyUserChatRoom

export declare const UserChatRoom: (new (init: ModelInit<UserChatRoom>) => UserChatRoom) & {
  copyOf(source: UserChatRoom, mutator: (draft: MutableModel<UserChatRoom>) => MutableModel<UserChatRoom> | void): UserChatRoom;
}