import { SelectedImage } from '@/hooks/useImagePrompt';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.ejemplo.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});


export function uploadFile(file: SelectedImage) {
    console.log(file);
    return api.post('/api/v1/upload/file', file);

}