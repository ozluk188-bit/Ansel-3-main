# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPostsByAuthor*](#getpostsbyauthor)
  - [*GetCommunityById*](#getcommunitybyid)
- [**Mutations**](#mutations)
  - [*CreatePost*](#createpost)
  - [*LikePost*](#likepost)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPostsByAuthor
You can execute the `GetPostsByAuthor` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPostsByAuthor(): QueryPromise<GetPostsByAuthorData, undefined>;

interface GetPostsByAuthorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPostsByAuthorData, undefined>;
}
export const getPostsByAuthorRef: GetPostsByAuthorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPostsByAuthor(dc: DataConnect): QueryPromise<GetPostsByAuthorData, undefined>;

interface GetPostsByAuthorRef {
  ...
  (dc: DataConnect): QueryRef<GetPostsByAuthorData, undefined>;
}
export const getPostsByAuthorRef: GetPostsByAuthorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPostsByAuthorRef:
```typescript
const name = getPostsByAuthorRef.operationName;
console.log(name);
```

### Variables
The `GetPostsByAuthor` query has no variables.
### Return Type
Recall that executing the `GetPostsByAuthor` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPostsByAuthorData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPostsByAuthorData {
  posts: ({
    id: UUIDString;
    content: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    createdAt: TimestampString;
  } & Post_Key)[];
}
```
### Using `GetPostsByAuthor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPostsByAuthor } from '@dataconnect/generated';


// Call the `getPostsByAuthor()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPostsByAuthor();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPostsByAuthor(dataConnect);

console.log(data.posts);

// Or, you can use the `Promise` API.
getPostsByAuthor().then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

### Using `GetPostsByAuthor`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPostsByAuthorRef } from '@dataconnect/generated';


// Call the `getPostsByAuthorRef()` function to get a reference to the query.
const ref = getPostsByAuthorRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPostsByAuthorRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.posts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.posts);
});
```

## GetCommunityById
You can execute the `GetCommunityById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCommunityById(vars: GetCommunityByIdVariables): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;

interface GetCommunityByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
}
export const getCommunityByIdRef: GetCommunityByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCommunityById(dc: DataConnect, vars: GetCommunityByIdVariables): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;

interface GetCommunityByIdRef {
  ...
  (dc: DataConnect, vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
}
export const getCommunityByIdRef: GetCommunityByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCommunityByIdRef:
```typescript
const name = getCommunityByIdRef.operationName;
console.log(name);
```

### Variables
The `GetCommunityById` query requires an argument of type `GetCommunityByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCommunityByIdVariables {
  communityId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCommunityById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCommunityByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCommunityByIdData {
  community?: {
    id: UUIDString;
    name: string;
    description: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Community_Key;
}
```
### Using `GetCommunityById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCommunityById, GetCommunityByIdVariables } from '@dataconnect/generated';

// The `GetCommunityById` query requires an argument of type `GetCommunityByIdVariables`:
const getCommunityByIdVars: GetCommunityByIdVariables = {
  communityId: ..., 
};

// Call the `getCommunityById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCommunityById(getCommunityByIdVars);
// Variables can be defined inline as well.
const { data } = await getCommunityById({ communityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCommunityById(dataConnect, getCommunityByIdVars);

console.log(data.community);

// Or, you can use the `Promise` API.
getCommunityById(getCommunityByIdVars).then((response) => {
  const data = response.data;
  console.log(data.community);
});
```

### Using `GetCommunityById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCommunityByIdRef, GetCommunityByIdVariables } from '@dataconnect/generated';

// The `GetCommunityById` query requires an argument of type `GetCommunityByIdVariables`:
const getCommunityByIdVars: GetCommunityByIdVariables = {
  communityId: ..., 
};

// Call the `getCommunityByIdRef()` function to get a reference to the query.
const ref = getCommunityByIdRef(getCommunityByIdVars);
// Variables can be defined inline as well.
const ref = getCommunityByIdRef({ communityId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCommunityByIdRef(dataConnect, getCommunityByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.community);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.community);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreatePost
You can execute the `CreatePost` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPost(vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;

interface CreatePostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
}
export const createPostRef: CreatePostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPost(dc: DataConnect, vars: CreatePostVariables): MutationPromise<CreatePostData, CreatePostVariables>;

interface CreatePostRef {
  ...
  (dc: DataConnect, vars: CreatePostVariables): MutationRef<CreatePostData, CreatePostVariables>;
}
export const createPostRef: CreatePostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPostRef:
```typescript
const name = createPostRef.operationName;
console.log(name);
```

### Variables
The `CreatePost` mutation requires an argument of type `CreatePostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePostVariables {
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreatePost` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePostData {
  post: Post_Key;
}
```
### Using `CreatePost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPost, CreatePostVariables } from '@dataconnect/generated';

// The `CreatePost` mutation requires an argument of type `CreatePostVariables`:
const createPostVars: CreatePostVariables = {
  content: ..., 
  imageUrl: ..., // optional
  videoUrl: ..., // optional
};

// Call the `createPost()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPost(createPostVars);
// Variables can be defined inline as well.
const { data } = await createPost({ content: ..., imageUrl: ..., videoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPost(dataConnect, createPostVars);

console.log(data.post);

// Or, you can use the `Promise` API.
createPost(createPostVars).then((response) => {
  const data = response.data;
  console.log(data.post);
});
```

### Using `CreatePost`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPostRef, CreatePostVariables } from '@dataconnect/generated';

// The `CreatePost` mutation requires an argument of type `CreatePostVariables`:
const createPostVars: CreatePostVariables = {
  content: ..., 
  imageUrl: ..., // optional
  videoUrl: ..., // optional
};

// Call the `createPostRef()` function to get a reference to the mutation.
const ref = createPostRef(createPostVars);
// Variables can be defined inline as well.
const ref = createPostRef({ content: ..., imageUrl: ..., videoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPostRef(dataConnect, createPostVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.post);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.post);
});
```

## LikePost
You can execute the `LikePost` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
likePost(vars: LikePostVariables): MutationPromise<LikePostData, LikePostVariables>;

interface LikePostRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LikePostVariables): MutationRef<LikePostData, LikePostVariables>;
}
export const likePostRef: LikePostRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
likePost(dc: DataConnect, vars: LikePostVariables): MutationPromise<LikePostData, LikePostVariables>;

interface LikePostRef {
  ...
  (dc: DataConnect, vars: LikePostVariables): MutationRef<LikePostData, LikePostVariables>;
}
export const likePostRef: LikePostRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the likePostRef:
```typescript
const name = likePostRef.operationName;
console.log(name);
```

### Variables
The `LikePost` mutation requires an argument of type `LikePostVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LikePostVariables {
  postId: UUIDString;
}
```
### Return Type
Recall that executing the `LikePost` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LikePostData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LikePostData {
  like: Like_Key;
}
```
### Using `LikePost`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, likePost, LikePostVariables } from '@dataconnect/generated';

// The `LikePost` mutation requires an argument of type `LikePostVariables`:
const likePostVars: LikePostVariables = {
  postId: ..., 
};

// Call the `likePost()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await likePost(likePostVars);
// Variables can be defined inline as well.
const { data } = await likePost({ postId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await likePost(dataConnect, likePostVars);

console.log(data.like);

// Or, you can use the `Promise` API.
likePost(likePostVars).then((response) => {
  const data = response.data;
  console.log(data.like);
});
```

### Using `LikePost`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, likePostRef, LikePostVariables } from '@dataconnect/generated';

// The `LikePost` mutation requires an argument of type `LikePostVariables`:
const likePostVars: LikePostVariables = {
  postId: ..., 
};

// Call the `likePostRef()` function to get a reference to the mutation.
const ref = likePostRef(likePostVars);
// Variables can be defined inline as well.
const ref = likePostRef({ postId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = likePostRef(dataConnect, likePostVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.like);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.like);
});
```

