import React from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';

interface ProfileButtonProps {
  avatarSrc: string;
  avatarAlt: string;
  name: string;
  username: string;
}



const ProfileButton = ({ avatarSrc, avatarAlt, name, username }: ProfileButtonProps) => {
  return (
    <button className="flex items-center p-2 bg-white rounded-lg shadow hover:bg-gray-100">
      <Avatar src={avatarSrc} alt={avatarAlt} size={32} />
      <div className="ml-2">
        <Username name={name} username={username} />
      </div>
    </button>
  );
};

export default ProfileButton;