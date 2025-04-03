import { useState } from "react";
import { cva } from "class-variance-authority";

interface FollowButtonProps {
    className?: string;
    hasFollow?: boolean;
    onClick: (hasFollow: boolean) => void; // Pass the new state to the parent
    username: string;
}

const followButtonStyles = cva(
    "flex items-center gap-1 hover:cursor-pointer px-4 py-2 rounded-full font-bold",
    {
        variants: {
            isFollowing: {
                true: "bg-primary text-white hover:bg-primary-hover",
                false: "bg-gray-200 text-black hover:bg-gray-300",
            },
        },
    }
);

const FollowButton = ({ className, hasFollow = false, onClick, username }: FollowButtonProps) => {
    const [isFollowing, setIsFollowing] = useState(hasFollow);

    const handleClick = () => {
        const newFollowState = isFollowing; // Fix the inversion
        setIsFollowing(!newFollowState); // Update local state
        onClick(!newFollowState); // Notify parent
    };

    return (
        <button
            className={`${followButtonStyles({ isFollowing })} ${className}`}
            onClick={handleClick}
        >
            <svg
                fill={isFollowing ? "#FFFFFF" : "#000000"}
                height="16px"
                width="16px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span>{isFollowing ? "Unfollow" : "Follow"}</span>
        </button>
    );
};

export default FollowButton;