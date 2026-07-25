import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // If running in a Vercel serverless environment (where filesystem is read-only)
    if (process.env.VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        // If file is under ~800KB (e.g. photos, short audio), gracefully fallback to base64 Data URL so preview testing works
        if (buffer.length < 800 * 1024) {
          const base64 = buffer.toString('base64');
          const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
          return NextResponse.json({ success: true, url: dataUrl });
        }
        return NextResponse.json({ 
          error: 'On Vercel serverless deployment, writing large video/audio files directly to disk is restricted. Please connect Vercel Blob Storage in your dashboard for live cloud uploads!' 
        }, { status: 500 });
      }
    }

    // Save directly to local public/uploads directory for local servers and self-hosting
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed: ' + error.message }, { status: 500 });
  }
}
