import fs from 'fs';
import path from 'path';

export function getPosts() {
  const filePath = path.join(process.cwd(), 'app/data/posts.json');
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading posts:', err);
    return [];
  }
}
