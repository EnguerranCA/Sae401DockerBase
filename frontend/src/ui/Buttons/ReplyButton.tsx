import React from 'react';
import { cva } from "class-variance-authority";

interface ReplyButtonProps {
    onClick: () => void;
    className?: string;
    replyCount?: number;
    variant?: 'default' | 'active';
}

const replyButtonStyles = cva(
    "flex items-center gap-1 hover:cursor-pointer",
    {
        variants: {
            variant: {
                default: "text-gray-500 hover:text-blue-500",
                active: "text-blue-500",
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const ReplyButton = ({ onClick, className = '', replyCount = 0, variant }: ReplyButtonProps) => {
    return (
        <button
            className={`${replyButtonStyles({ variant })} ${className}`}
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                />
            </svg>
            {replyCount > 0 && <span>{replyCount}</span>}
        </button>
    );
};

export default ReplyButton; 