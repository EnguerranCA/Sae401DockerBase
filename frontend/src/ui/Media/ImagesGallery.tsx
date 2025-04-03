import { cva } from "class-variance-authority";

interface ImagesGalleryProps {
    images: string[];
    className?: string;
    variant?: 'medium';
}

const imagesGalleryStyles = cva(
    "  font-bold py-2 px-4 rounded-full focus:outline-hidden w-full",
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

const ImagesGallery = ({ images, className, variant }: ImagesGalleryProps) => {
    const renderImages = () => {
        const imageCount = images.length;

        if (imageCount === 1) {
            return (
                <div className="w-full h-auto">
                    <img src={`http://localhost:8080/uploads/media/${images[0]}`} alt="Gallery" className="w-full h-auto object-cover rounded-lg" />
                </div>
            );
        }

        if (imageCount === 2) {
            return (
                <div className="grid grid-cols-2 gap-2">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:8080/uploads/media/${image}`}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    ))}
                </div>
            );
        }

        if (imageCount === 3) {
            return (
                <div className="grid grid-cols-2 gap-2">
                    <img
                        src={`http://localhost:8080/uploads/media/${images[0]}`}
                        alt="Gallery 1"
                        className="col-span-2 w-full h-auto object-cover rounded-lg"
                    />
                    {images.slice(1).map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:8080/uploads/media/${image}`}
                            alt={`Gallery ${index + 2}`}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    ))}
                </div>
            );
        }

        if (imageCount >= 4) {
            return (
                <div className="grid grid-cols-2 gap-2">
                    {images.slice(0, 4).map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:8080/uploads/media/${image}`}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`$${imagesGalleryStyles({ variant })} ${className}`}>
            {renderImages()}
        </div>
    );
};

export default ImagesGallery;