import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-interview-resumes',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt'],
    resource_type: 'raw', // Use raw for non-image files like PDFs
  },
});

export const upload = multer({ storage: storage });
export { cloudinary };
