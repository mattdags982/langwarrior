import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveAudioToStorage(audioPath: string): Promise<string> {
  try {
    // Remove leading slash if present and join with public directory
    const relativePath = audioPath.replace(/^\//, '');
    const fullPath = join(process.cwd(), 'public', relativePath);
    
    console.log('Reading audio file from:', fullPath);
    const audioBuffer = await readFile(fullPath);

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'audio',
            resource_type: 'video', // Cloudinary uses 'video' type for audio files
          },
          (err: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
            if (err) reject(err);
            else if (result) resolve(result);
            else reject(new Error('No result from Cloudinary'));
          }
        )
        .end(audioBuffer);
    });

    console.log('Successfully uploaded to Cloudinary with public_id:', result.public_id);
    return result.public_id;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
} 