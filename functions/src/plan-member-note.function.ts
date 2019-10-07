import * as functions from 'firebase-functions';
import { countUp, countDown } from './utils';

export const createNote = functions.firestore
  .document(`channels/{channelId}/plans/{planId}/members/{memberId}/notes/{noteId}`)
  .onCreate((snapshot, context) => {
    return countUp(`channels/${context.params.channelId}/plans/${context.params.planId}/members/${context.params.memberId}`, 'noteCount');
  })

export const deleteNote = functions.firestore
  .document(`channels/{channelId}/plans/{planId}/members/{memberId}/notes/{noteId}`)
  .onDelete((snapshot, context) => {
    return countDown(`channels/${context.params.channelId}/plans/${context.params.planId}/members/${context.params.memberId}`, 'noteCount');
  })
