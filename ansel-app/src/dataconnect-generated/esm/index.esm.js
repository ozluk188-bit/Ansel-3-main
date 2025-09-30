import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'ansel-2',
  location: 'us-central1'
};

export const createPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePost', inputVars);
}
createPostRef.operationName = 'CreatePost';

export function createPost(dcOrVars, vars) {
  return executeMutation(createPostRef(dcOrVars, vars));
}

export const getPostsByAuthorRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPostsByAuthor');
}
getPostsByAuthorRef.operationName = 'GetPostsByAuthor';

export function getPostsByAuthor(dc) {
  return executeQuery(getPostsByAuthorRef(dc));
}

export const likePostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LikePost', inputVars);
}
likePostRef.operationName = 'LikePost';

export function likePost(dcOrVars, vars) {
  return executeMutation(likePostRef(dcOrVars, vars));
}

export const getCommunityByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCommunityById', inputVars);
}
getCommunityByIdRef.operationName = 'GetCommunityById';

export function getCommunityById(dcOrVars, vars) {
  return executeQuery(getCommunityByIdRef(dcOrVars, vars));
}

