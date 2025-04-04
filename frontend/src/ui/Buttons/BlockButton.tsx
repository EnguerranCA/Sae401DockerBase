import React from 'react';
import Users from '../../data/data-users';

interface BlockButtonProps {
    hasBlock: boolean;
    onClick: (hasBlock: boolean) => void;
    username: string;
    className?: string;
}

const BlockButton = ({ hasBlock, onClick, username, className = '' }: BlockButtonProps) => {
    const handleClick = async () => {
        try {
            if (hasBlock) {
                await Users.unblockUser(username);
            } else {
                // Vérifier si l'utilisateur est suivi avant de le bloquer
                const userData = await Users.getUserInfoByUsername(username);
                if (userData && userData.isFollowed) {
                    await Users.unfollowUser(username);
                }
                await Users.blockUser(username);
            }
            onClick(!hasBlock);
            window.location.reload(); // Recharger pour mettre à jour l'état
        } catch (error) {
            console.error('Error toggling block:', error);
        }
    };

    return (
        <button
            className={`px-4 py-2 rounded-full ${hasBlock ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} ${className}`}
            onClick={handleClick}
        >
            {hasBlock ? 'Unblock' : 'Block'}
        </button>
    );
};

export default BlockButton; 