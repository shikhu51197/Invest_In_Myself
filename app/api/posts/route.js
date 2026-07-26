import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';
import { revalidatePath } from 'next/cache';

function checkAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!process.env.ADMIN_SECRET) {
    if (authHeader === 'local_dev' && !process.env.VERCEL) return true;
    return false;
  }
  return authHeader === process.env.ADMIN_SECRET;
}

export async function GET() {
  // If Vercel KV is configured, use it
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const posts = await kv.get('posts');
      return NextResponse.json(posts || []);
    } catch (err) {
      console.error('Error reading from KV:', err);
      return NextResponse.json([]);
    }
  }

  // Fallback to local file system for local development
  const filePath = path.join(process.cwd(), 'app/data/posts.json');
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileData));
  } catch (err) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized: Admin password required to publish posts.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const newPost = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...body
    };

    // If Vercel KV is configured, use it
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        let posts = await kv.get('posts') || [];
        posts.unshift(newPost);
        await kv.set('posts', posts);
        try {
          revalidatePath('/');
          revalidatePath('/explore');
        } catch (_) {}
        return NextResponse.json({ success: true, post: newPost });
      } catch (kvError) {
        console.error('KV Error:', kvError);
        return NextResponse.json({ error: 'Failed to save post to KV Database: ' + kvError.message }, { status: 500 });
      }
    }

    // Fallback to local file system for local development
    const filePath = path.join(process.cwd(), 'app/data/posts.json');
    let posts = [];
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      posts = JSON.parse(fileData);
    } catch (err) {
      // file might not exist, ignore
    }

    posts.unshift(newPost);
    try {
      fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
    } catch (fsError) {
      if (process.env.VERCEL) {
        return NextResponse.json({ error: 'You are on Vercel but Vercel KV is not configured! Please set it up in the Vercel Dashboard.' }, { status: 500 });
      }
      return NextResponse.json({ error: 'Failed to save to local file: ' + fsError.message }, { status: 500 });
    }

    try {
      revalidatePath('/');
      revalidatePath('/explore');
    } catch (_) {}
    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: 'Failed to save post: ' + error.message }, { status: 500 });
  }
}

