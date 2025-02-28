import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const unlinkFile = promisify(fs.unlink);

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const bucketName = process.env.AWS_BUCKET_NAME || '';

export const uploadToS3 = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const fileStream = fs.createReadStream(file.path);
  const key = `${folder}/${path.basename(file.path)}`;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: key,
    ContentType: file.mimetype
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Generate a clean URL without signed parameters
    const cleanUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Clean up the local file
    await unlinkFile(file.path);
    
    return cleanUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

export const deleteFromS3 = async (fileKey: string): Promise<void> => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileKey
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
};