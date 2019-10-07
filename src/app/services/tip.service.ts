import { Injectable } from '@angular/core';
import { Tips } from '../interfaces/tip';

export const TIPS: Tips = {
  'bc7ca512-be82-5d9e-9c4d-21c0abb03ef5': {
    id: 'bc7ca512-be82-5d9e-9c4d-21c0abb03ef5',
    title: 'aaaaa'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TipService {

  constructor() { }
}
