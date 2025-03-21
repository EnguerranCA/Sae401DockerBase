import React from 'react';


interface AvatarProps {
    src: string;
    alt: string;
    size?: number;
    className?: string;
}

const Avatar = ({ src, alt, size = 24, className }: AvatarProps) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`rounded-full ${className}`}
            style={{ width: size, height: size }}
        />
    );
};

export default Avatar;