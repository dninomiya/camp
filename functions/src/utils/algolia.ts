import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const isProd = functions.config().env.mode === 'prod';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(isProd ? 'lessons' : 'lessons-dev')

const addRecords = (item: any) => {
  const records = item.body.match(/[\s\S]{1,500}/gm).map((body: any, i: number) => {
    return {
      ...item,
      objectID: item.id + '-' + i,
      body
    }
  });

  return Promise.all(records.map((record: any) => index.addObject(record)));
}

export const addIndex = (data: any) => {
  const item = data;
  item.objectID = data.id;
  item.createdAt = Date.now();

  if (item.body && item.body.length > 500) {
    return addRecords(item);
  } else {
    return index.addObject(item);
  }
}

export const removeIndex = (id: string) => {
  return index.deleteBy({filters: `id:${id}`});
}

export const updateIndex = async (data: any) => {
  const item = data;
  item.objectID = data.id;
  item.updatedAt = item.updatedAt.toMillis();
  item.createdAt = item.createdAt.toMillis();
  await removeIndex(item.id);
  return addRecords(item);
}
