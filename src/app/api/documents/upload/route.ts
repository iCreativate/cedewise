import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/aws';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get('file');
    const bucketName = String(formData.get('bucketName') || 'cedewise-documents').trim();
    const folderPath = String(formData.get('folderPath') || '').trim();

    if (!fileEntry || typeof fileEntry === 'string') {
      return NextResponse.json({ success: false, error: 'Missing file' }, { status: 400 });
    }

    const file = fileEntry as File;
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9-.]/g, '_');
    const key = folderPath
      ? `${folderPath.replace(/\/$/, '')}/${timestamp}-${cleanFileName}`
      : `${timestamp}-${cleanFileName}`;

    const hasAws =
      Boolean(process.env.AWS_ACCESS_KEY_ID) && Boolean(process.env.AWS_SECRET_ACCESS_KEY);

    if (!hasAws) {
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          key,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url: null,
        });
      }
      return NextResponse.json(
        { success: false, error: 'Document storage is not configured.' },
        { status: 503 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || 'application/octet-stream';
    const uploadResult = await uploadFileToS3(bucketName, key, buffer, contentType);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: 'Upload to storage failed.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      key,
      name: file.name,
      type: contentType,
      size: file.size,
      url: uploadResult.url as string,
    });
  } catch (e) {
    console.error('[documents/upload]', e);
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
