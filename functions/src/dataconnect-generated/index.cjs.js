const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'ansel-2',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createPostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePost', inputVars);
}
createPostRef.operationName = 'CreatePost';
exports.createPostRef = createPostRef;

exports.createPost = function createPost(dcOrVars, vars) {
  return executeMutation(createPostRef(dcOrVars, vars));
};

const getPostsByAuthorRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPostsByAuthor');
}
getPostsByAuthorRef.operationName = 'GetPostsByAuthor';
exports.getPostsByAuthorRef = getPostsByAuthorRef;

exports.getPostsByAuthor = function getPostsByAuthor(dc) {
  return executeQuery(getPostsByAuthorRef(dc));
};

const likePostRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LikePost', inputVars);
}
likePostRef.operationName = 'LikePost';
exports.likePostRef = likePostRef;

exports.likePost = function likePost(dcOrVars, vars) {
  return executeMutation(likePostRef(dcOrVars, vars));
};

const getCommunityByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCommunityById', inputVars);
}
getCommunityByIdRef.operationName = 'GetCommunityById';
exports.getCommunityByIdRef = getCommunityByIdRef;

exports.getCommunityById = function getCommunityById(dcOrVars, vars) {
  return executeQuery(getCommunityByIdRef(dcOrVars, vars));
};
