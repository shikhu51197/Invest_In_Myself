import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

export async function getPosts() {
  // If Vercel KV is configured, use it
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const posts = await kv.get('posts');
      return posts || [];
    } catch (err) {
      console.error('Error reading from KV:', err);
      return [];
    }
  }

  // Fallback to local file system
  const filePath = path.join(process.cwd(), 'app/data/posts.json');
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading posts:', err);
    return [];
  }
}
