import axios from 'axios';
import { config } from '../config';

export const postActivity = (content: string) => {
  return axios.post(config.webhook.discord, { content });
};
