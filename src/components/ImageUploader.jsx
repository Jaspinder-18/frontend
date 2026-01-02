import { useState } from 'react';
import api from '../utils/api';

const ImageUploader = ({ currentImage, onImageUpload, label = "Image", className = "" }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload
        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const res = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const uploadedUrl = res.data.filePath; // Expecting { filePath: '/uploads/...' }
            // Backend returns relative path, we might need full URL if it's stored that way, 
            // but usually we just store the path and prepend server URL when debugging or if using proxy.
            // Current usage seems to prepend http://localhost:5000 in some places, so we likely just need the path.

            onImageUpload(uploadedUrl);
        } catch (err) {
            console.error('Upload failed', err);
            alert('Image upload failed');
            // Revert preview on failure if needed, or keep it to show what they tried
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-gray-400 text-sm mb-1">{label}</label>

            <div className="flex items-start gap-4">
                {preview && (
                    <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-700 bg-primary-black shrink-0">
                        <img
                            src={preview.startsWith('blob:') ? preview : preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback
                            }}
                        />
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-orange"></div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="w-full px-4 py-2 bg-primary-dark border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-orange file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-orange file:text-white hover:file:bg-primary-red disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Recommended: JPG, PNG, WEBP. Max 5MB.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
