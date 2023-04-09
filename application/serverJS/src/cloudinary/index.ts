/**
 * Cloudinary configuration for uploading food images
 */
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'UWCcnpm',
            allowedFormats: ['jpeg', 'png', 'jpg','gif']
        };
    },
});

export const cloudinaryUtils = cloudinary
