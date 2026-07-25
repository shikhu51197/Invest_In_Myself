import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    // Fallback to check single 'file' key if present
    if (files.length === 0 && formData.get('file')) {
      files.push(formData.get('file'));
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files received by server.' }, { status: 400 });
    }

    const uploadedItems = [];

    for (const file of files) {
      if (typeof file === 'string' || !file.arrayBuffer) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const cleanName = (file.name || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanName}`;

      let mediaType = 'image';
      if ((file.type && file.type.startsWith('video/')) || filename.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
        mediaType = 'video';
      } else if ((file.type && file.type.startsWith('audio/')) || filename.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        mediaType = 'audio';
      } else if (!file.type?.startsWith('image/') && !filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        mediaType = 'document';
      }

      // If running in a Vercel serverless environment (where filesystem is read-only)
      if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
        uploadedItems.push({ url: dataUrl, type: mediaType, name: file.name || cleanName });
        continue;
      }

      // Save directly to local public/uploads directory for local development and self-hosting
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filePath, buffer);
      uploadedItems.push({ url: `/uploads/${filename}`, type: mediaType, name: file.name || cleanName });
    }

    if (uploadedItems.length === 0) {
      return NextResponse.json({ error: 'No valid binary files found to process.' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      mediaList: uploadedItems,
      url: uploadedItems[0].url,
      type: uploadedItems[0].type
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Server exception during file upload: ' + error.message }, { status: 500 });
  }
}
