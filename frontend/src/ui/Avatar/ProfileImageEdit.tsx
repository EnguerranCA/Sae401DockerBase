import { useState } from "react";
import Users from "../../data/data-users";

interface ProfileImageEditProps {
    size?: number;
    className?: string;
}

const ProfileImageEdit = ({ size = 24, className }: ProfileImageEditProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);

            // Automatically upload the image
            setIsUploading(true);
            try {
                await Users.updateImage(file);
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
            <label htmlFor="profile-files" className="btn bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center">✏️</label>
            <input
            id="profile-files"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={isUploading}
            />
        </div>
    );
};

export default ProfileImageEdit;
