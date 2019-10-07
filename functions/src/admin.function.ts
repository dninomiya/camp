import * as functions from 'firebase-functions';
import { countUp } from './utils/count-up';
import { countDown } from './utils/count-down';

export const incrementUserCount = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    return countUp('admin/count', 'users');
  });

export const decrementUserCount = functions.firestore
  .document('users/{userId}')
  .onDelete((snap, context) => {
    return countDown('admin/count', 'users');
  });
