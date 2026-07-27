import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const posts = await kv.get('posts') || [];
      const post = posts.find(p => p.id === id);
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      return NextResponse.json(post);
    }

    const filePath = path.join(process.cwd(), 'app/data/posts.json');
    if (fs.existsSync(filePath)) {
      const posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const post = posts.find(p => p.id === id);
      if (post) return NextResponse.json(post);
    }
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function triggerRevalidation(id) {
  try {
    revalidatePath('/');
    revalidatePath('/explore');
    revalidatePath(`/post/${id}`);
  } catch (_) {}
}

function checkAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!process.env.ADMIN_SECRET) {
    // If no admin secret is set in the environment, we might want to fail securely.
    // But for local development, we'll allow it if it matches 'local_dev'
    if (authHeader === 'local_dev' && !process.env.VERCEL) return true;
    return false;
  }
  return authHeader === process.env.ADMIN_SECRET;
}

export async function PUT(request, { params }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const body = await request.json();
    const id = resolvedParams.id;

    // Use KV if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      let posts = await kv.get('posts') || [];
      const index = posts.findIndex(p => p.id === id);
      if (index === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      
      posts[index] = { ...posts[index], ...body };
      await kv.set('posts', posts);
      triggerRevalidation(id);
      return NextResponse.json({ success: true, post: posts[index] });
    }

    // Fallback to local file system
    const filePath = path.join(process.cwd(), 'app/data/posts.json');
    let posts = [];
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      posts = JSON.parse(fileData);
    } catch (err) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 500 });
    }

    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    posts[index] = { ...posts[index], ...body };
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    triggerRevalidation(id);
    return NextResponse.json({ success: true, post: posts[index] });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Use KV if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      let posts = await kv.get('posts') || [];
      const newPosts = posts.filter(p => p.id !== id);
      if (posts.length === newPosts.length) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      
      await kv.set('posts', newPosts);
      triggerRevalidation(id);
      return NextResponse.json({ success: true });
    }

    // Fallback to local file system
    const filePath = path.join(process.cwd(), 'app/data/posts.json');
    let posts = [];
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      posts = JSON.parse(fileData);
    } catch (err) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 500 });
    }

    const newPosts = posts.filter(p => p.id !== id);
    if (posts.length === newPosts.length) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    fs.writeFileSync(filePath, JSON.stringify(newPosts, null, 2));

    triggerRevalidation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post: ' + error.message }, { status: 500 });
  }
}
