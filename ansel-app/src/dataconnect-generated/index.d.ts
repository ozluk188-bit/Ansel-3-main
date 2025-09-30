import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CommunityMember_Key {
  userId: UUIDString;
  communityId: UUIDString;
  __typename?: 'CommunityMember_Key';
}

export interface Community_Key {
  id: UUIDString;
  __typename?: 'Community_Key';
}

export interface CreatePostData {
  post: Post_Key;
}

export interface CreatePostVariables {
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

export interface Follow_Key {
  followerId: UUIDString;
  followeeId: UUIDString;
  __typename?: 'Follow_Key';
}

export interface GetCommunityByIdData {
  community?: {
    id: UUIDString;
    name: string;
    description: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Community_Key;
}

export interface GetCommunityByIdVariables {
  communityId: UUIDString;
}

export interface GetPostsByAuthorData {
  posts: ({
    id: UUIDString;
    content: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    createdAt: TimestampString;
  } & Post_Key)[];
}

export interface LikePostData {
  like: Like_Key;
}

export interface LikePostVariables {
  postId: UUIDString;
}

export interface Like_Key {
  userId: UUIDString;
  postId: UUIDString;
  __typename?: 'Like_Key';
}

export interface Post_Key {
  id: UUIDString;
  __typename?: 'Post_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreatePostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
  operationName: string;
}
export const createPostRef: CreatePostRef;

export function createPost(vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;
export function createPost(dc: DataConnect, vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;

interface GetPostsByAuthorRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPostsByAuthorData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPostsByAuthorData, undefined>;
  operationName: string;
}
export const getPostsByAuthorRef: GetPostsByAuthorRef;

export function getPostsByAuthor(): QueryPromise<GetPostsByAuthorData, undefined>;
export function getPostsByAuthor(dc: DataConnect): QueryPromise<GetPostsByAuthorData, undefined>;

interface LikePostRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LikePostVariables): MutationRef<LikePostData, LikePostVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LikePostVariables): MutationRef<LikePostData, LikePostVariables>;
  operationName: string;
}
export const likePostRef: LikePostRef;

export function likePost(vars: LikePostVariables): MutationPromise<LikePostData, LikePostVariables>;
export function likePost(dc: DataConnect, vars: LikePostVariables): MutationPromise<LikePostData, LikePostVariables>;

interface GetCommunityByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
  operationName: string;
}
export const getCommunityByIdRef: GetCommunityByIdRef;

export function getCommunityById(vars: GetCommunityByIdVariables): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;
export function getCommunityById(dc: DataConnect, vars: GetCommunityByIdVariables): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;

