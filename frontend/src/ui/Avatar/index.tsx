import React from 'react';

interface AvatarProps {
    src: string;
    alt: string;
    size?: number;
}

const Avatar = ({ src, alt, size = 24 }: AvatarProps) => {
    return (
        <img
            src={src}
            alt={alt}
            className="rounded-full"
            style={{ width: size, height: size }}
        />
    );
};

export default Avatar;