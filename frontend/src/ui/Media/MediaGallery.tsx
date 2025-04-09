import { cva } from "class-variance-authority";
import { config } from '../../config/config';

const { UPLOADS_URL } = config;


interface MediaGalleryProps {
    images: string[];
    className?: string;
    variant?: 'medium';
}

const mediaGalleryStyles = cva(
    "font-bold py-2 px-4 rounded-full focus:outline-hidden w-full",
    {
        variants: {
            variant: {
                medium: "",
            },
        },
        defaultVariants: {
            variant: 'medium',
        },
    }
);

const isVideo = (filename: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

const MediaGallery = ({ images, className, variant }: MediaGalleryProps) => {
    const renderMedia = () => {
        const mediaCount = images.length;

        if (mediaCount === 1) {
            const media = images[0];
            if (isVideo(media)) {
                return (
                    <div className="w-full h-auto max-w-[400px] mx-auto">
                        <video
                            src={`${UPLOADS_URL}/media/${media}`}
                            controls
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                );
            }
            return (
                <div className="w-full h-auto max-w-[400px] mx-auto">
                    <img src={`http://localhost:8080/uploads/media/${media}`} alt="Gallery" className="w-full h-auto object-cover rounded-lg" />
                </div>
            );
        }

        if (mediaCount === 2) {
            return (
                <div className="grid grid-cols-2 gap-2 max-w-[400px] mx-auto">
                    {images.map((media, index) => (
                        isVideo(media) ? (
                            <video
                                key={index}
                                src={`${UPLOADS_URL}/media/${media}`}
                                controls
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        ) : (
                            <img
                                key={index}
                                src={`${UPLOADS_URL}/media/${media}`}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        )
                    ))}
                </div>
            );
        }

        if (mediaCount === 3) {
            return (
                <div className="grid grid-cols-2 gap-2 max-w-[400px] mx-auto">
                    {isVideo(images[0]) ? (
                        <video
                            src={`${UPLOADS_URL}/media/${images[0]}`}
                            controls
                            className="col-span-2 w-full h-auto object-cover rounded-lg"
                        />
                    ) : (
                        <img
                            src={`${UPLOADS_URL}/media/${images[0]}`}
                            alt="Gallery 1"
                            className="col-span-2 w-full h-auto object-cover rounded-lg"
                        />
                    )}
                    {images.slice(1).map((media, index) => (
                        isVideo(media) ? (
                            <video
                                key={index}
                                src={`${UPLOADS_URL}/media/${media}`}
                                controls
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        ) : (
                            <img
                                key={index}
                                src={`${UPLOADS_URL}/media/${media}`}
                                alt={`Gallery ${index + 2}`}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        )
                    ))}
                </div>
            );
        }

        if (mediaCount >= 4) {
            return (
                <div className="grid grid-cols-2 gap-2 max-w-[400px] mx-auto">
                    {images.slice(0, 4).map((media, index) => (
                        isVideo(media) ? (
                            <video
                                key={index}
                                src={`${UPLOADS_URL}/media/${media}`}
                                controls
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        ) : (
                            <img
                                key={index}
                                src={`${UPLOADS_URL}/media/${media}`}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        )
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`${mediaGalleryStyles({ variant })} ${className}`}>
            {renderMedia()}
        </div>
    );
};

export default MediaGallery;