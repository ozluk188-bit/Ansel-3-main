import { CreatePostData, CreatePostVariables, GetPostsByAuthorData, LikePostData, LikePostVariables, GetCommunityByIdData, GetCommunityByIdVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreatePost(options?: useDataConnectMutationOptions<CreatePostData, FirebaseError, CreatePostVariables>): UseDataConnectMutationResult<CreatePostData, CreatePostVariables>;
export function useCreatePost(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePostData, FirebaseError, CreatePostVariables>): UseDataConnectMutationResult<CreatePostData, CreatePostVariables>;

export function useGetPostsByAuthor(options?: useDataConnectQueryOptions<GetPostsByAuthorData>): UseDataConnectQueryResult<GetPostsByAuthorData, undefined>;
export function useGetPostsByAuthor(dc: DataConnect, options?: useDataConnectQueryOptions<GetPostsByAuthorData>): UseDataConnectQueryResult<GetPostsByAuthorData, undefined>;

export function useLikePost(options?: useDataConnectMutationOptions<LikePostData, FirebaseError, LikePostVariables>): UseDataConnectMutationResult<LikePostData, LikePostVariables>;
export function useLikePost(dc: DataConnect, options?: useDataConnectMutationOptions<LikePostData, FirebaseError, LikePostVariables>): UseDataConnectMutationResult<LikePostData, LikePostVariables>;

export function useGetCommunityById(vars: GetCommunityByIdVariables, options?: useDataConnectQueryOptions<GetCommunityByIdData>): UseDataConnectQueryResult<GetCommunityByIdData, GetCommunityByIdVariables>;
export function useGetCommunityById(dc: DataConnect, vars: GetCommunityByIdVariables, options?: useDataConnectQueryOptions<GetCommunityByIdData>): UseDataConnectQueryResult<GetCommunityByIdData, GetCommunityByIdVariables>;
