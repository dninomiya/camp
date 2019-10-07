import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const isProd = functions.config().env.mode === 'prod';

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

export const addIndex = (data: any) => {
  const item = data;
  item.objectID = data.id;
  item.createdAt = Date.now();
  const index = client.initIndex(isProd ? 'lessons' : 'lessons-dev');
  return index.addObject(item);
}

export const updateIndex = (data: any) => {
  const item = data;
  item.objectID = data.id;
  delete item.createdAt
  const index = client.initIndex(isProd ? 'lessons' : 'lessons-dev');
  return index.partialUpdateObject(item);
}

export const removeIndex = (id: string) => {
  const index = client.initIndex(isProd ? 'lessons' : 'lessons-dev');
  return index.deleteObject(id);
}
