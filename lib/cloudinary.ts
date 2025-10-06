import { CloudinaryUploadResult } from "@/types";

export const cloudinaryService = {
    // Upload multiple images to Cloudinary
    uploadImages: async (files: File[]): Promise<CloudinaryUploadResult[]> => {
        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'cars_upload'); // Create this in Cloudinary

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Image upload failed: ${response.statusText}`);
            }

            return response.json();
        });

        return Promise.all(uploadPromises);
    },

    // Delete image from Cloudinary
    deleteImage: async (publicId: string): Promise<void> => {
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('upload_preset', 'cars_upload');

        await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                method: 'POST',
                body: formData,
            }
        );
    },
};