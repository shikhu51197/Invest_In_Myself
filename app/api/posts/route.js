import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'app/data/posts.json');
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileData));
  } catch (err) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'app/data/posts.json');
    
    // Read existing
    let posts = [];
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      posts = JSON.parse(fileData);
    } catch (err) {
      // file might not exist, ignore
    }

    // Add new post
    const newPost = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...body
    };

    posts.unshift(newPost); // Add to beginning

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}
