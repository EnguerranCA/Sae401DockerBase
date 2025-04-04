import React, { useState, useEffect } from 'react';
import Users from '../../data/data-users';

interface FollowButtonProps {
    hasFollow: boolean;
    onClick: (hasFollow: boolean) => void;
    username: string;
    className?: string;
}

const FollowButton = ({ hasFollow, onClick, username, className = '' }: FollowButtonProps) => {
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        const checkBlockStatus = async () => {
            try {
                const userData = await Users.getUserInfoByUsername(username);
                const currentUser = await Users.getCurrentUserInfo();
                const currentUsername = localStorage.getItem('username');

                // Vérifier si l'utilisateur nous a bloqué
                const isBlockedByUser = userData?.blockedUsers?.some(
                    (blockedUser: any) => blockedUser.username === currentUsername
                ) || false;

                // Vérifier si nous avons bloqué l'utilisateur
                const hasBlockedUser = currentUser?.blockedUsers?.some(
                    (blockedUser: any) => blockedUser.username === username
                ) || false;

                console.log('Block status check:', {
                    username,
                    currentUsername,
                    isBlockedByUser,
                    hasBlockedUser,
                    userBlockedUsers: userData?.blockedUsers,
                    currentUserBlockedUsers: currentUser?.blockedUsers
                });

                setIsBlocked(isBlockedByUser || hasBlockedUser);
            } catch (error) {
                console.error('Error checking block status:', error);
            }
        };
        checkBlockStatus();
    }, [username]);

    const handleClick = async () => {
        if (isBlocked) {
            alert('You cannot follow this user because one of you has blocked the other.');
            return;
        }

        try {
            if (hasFollow) {
                await Users.unfollowUser(username);
            } else {
                await Users.followUser(username);
            }
            onClick(!hasFollow);
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    if (isBlocked) {
        return (
            <button
                className={`px-4 py-2 rounded-full bg-gray-200 text-gray-500 cursor-not-allowed ${className}`}
                disabled
            >
                Blocked
            </button>
        );
    }

    return (
        <button
            className={`px-4 py-2 rounded-full ${hasFollow ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white'} ${className}`}
            onClick={handleClick}
        >
            {hasFollow ? 'Unfollow' : 'Follow'}
        </button>
    );
};

export default FollowButton;