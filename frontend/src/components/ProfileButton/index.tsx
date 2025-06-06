import React from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';
import { useNavigate } from 'react-router-dom';

interface ProfileButtonProps {
  user: {
    avatar: string;
    name: string;
    username: string;
  };
  className?: string;
}

const ProfileButton = ({ user: { avatar, name, username } }: ProfileButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100"
    >
      <Avatar src={`http://localhost:8080/uploads/avatars/${avatar}`} alt={username} size={32} className="md:size-32 size-64" />
      <div className="ml-2">
        <Username name={name} username={username} />
      </div>
    </button>
  );
};

export default ProfileButton;