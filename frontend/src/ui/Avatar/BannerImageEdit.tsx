import { useState } from "react";
import Users from "../../data/data-users";

interface BannerImageEditProps {
    size?: number;
    className?: string;
}

const BannerImageEdit = ({ size = 24, className }: BannerImageEditProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleBannerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);

            // Automatically upload the image
            setIsUploading(true);
            try {
                await Users.updateBanner(file);
                alert("Image uploaded successfully!");
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <label htmlFor="files" className="btn bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center">✏️</label>
            <input
            id="files"
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
            disabled={isUploading}
            />
        </div>
    );
};

export default BannerImageEdit;
