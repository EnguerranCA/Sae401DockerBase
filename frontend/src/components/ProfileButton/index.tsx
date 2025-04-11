import React from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';

interface ProfileButtonProps {
  user: {
    avatar: string;
    name: string;
    username: string;
  };
  className?: string;
}



const ProfileButton = ({ user: { avatar, name, username } }: ProfileButtonProps) => {
  return (
    <button data-user="1" className="flex items-center p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100">
      <Avatar src='../src/assets/images/default_pp.png' alt={username} size={32} className="md:size-32 size-64" />
      <div className="ml-2">
        <Username name={name} username={username} />
      </div>
    </button>
  );
};

export default ProfileButton;