import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = (import.meta as any).env.VITE_R2_ACCOUNT_ID || '';
const accessKeyId = (import.meta as any).env.VITE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = (import.meta as any).env.VITE_R2_SECRET_ACCESS_KEY || '';
const bucketName = (import.meta as any).env.VITE_R2_BUCKET_NAME || '';
const publicUrl = (import.meta as any).env.VITE_R2_PUBLIC_URL || '';

export const isR2Configured = Boolean(
  accountId && 
  accessKeyId && 
  secretAccessKey && 
  bucketName && 
  publicUrl
);

let s3Client: S3Client | null = null;

if (isR2Configured) {
  // Cloudflare R2 uses an S3-compatible API via S3Client under 'auto' region
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads a base64 image string or Blob file directly to Cloudflare R2.
 * Returns the final public CDN URL of the uploaded asset.
 * 
 * @param base64OrBlob Base64 Data URL or standard Blob object
 * @param fileName Desired file name
 */
export async function uploadToR2(base64OrBlob: string | Blob, fileName: string): Promise<string> {
  if (!isR2Configured || !s3Client) {
    throw new Error('Cloudflare R2 is not fully configured. Provide VITE_R2_ACCOUNT_ID, etc.');
  }

  let body: Uint8Array | Blob;
  let contentType = 'image/jpeg';

  if (typeof base64OrBlob === 'string' && base64OrBlob.startsWith('data:')) {
    const parts = base64OrBlob.split(',');
    const mimeMatch = parts[0].match(/data:(.*?);/);
    if (mimeMatch) {
      contentType = mimeMatch[1];
    }
    const binaryStr = atob(parts[1]);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    body = bytes;
  } else if (base64OrBlob instanceof Blob) {
    body = base64OrBlob;
    contentType = base64OrBlob.type || 'image/jpeg';
  } else {
    throw new Error('Format upload gambar tidak valid');
  }

  // Sanitize filename to avoid weird character issues on CDN urls
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const key = `uploads/${timestamp}-${cleanFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Generate public link from Cloudflare R2 Public URL / Custom domain
  const normalizedPublicUrl = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`;
  return `${normalizedPublicUrl}${key}`;
}
