import axios from 'axios';
import { Verse, EmotionCategory } from './types';

// Update this URL to your server's IP address when testing on device
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchVerseByEmotion = async (emotion: EmotionCategory): Promise<Verse> => {
  const timestamp = Date.now();
  const response = await api.get(`/api/verses/${emotion}?t=${timestamp}`);
  return response.data;
};

export const shareVerse = async (verse: Verse): Promise<void> => {
  // For mobile, we'll use the device's share functionality
  // This will be implemented in the component
  console.log('Sharing verse:', verse);
}; 