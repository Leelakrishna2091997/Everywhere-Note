// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PostStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE"
};

const { Todo, Post, Notes } = initSchema(schema);

export {
  Todo,
  Post,
  Notes,
  PostStatus
};