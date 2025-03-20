import React, { useState, useEffect } from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';

interface TweetProps {
  message: string;
  user: {
    avatar: string;
    name: string;
    username: string;
  };
}

const Tweet = ({ user, message }: TweetProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-white w-full flex gap-4 border animate-pulse">
        <div className="bg-gray-300 rounded-full h-16 w-16"></div>
        <div className="flex mb-2 flex-col gap-2">
          <div className="bg-gray-300 h-4 w-24 rounded"></div>
          <div className="bg-gray-300 h-4 w-full rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4  bg-white w-full flex gap-4 border">
      <Avatar src={user.avatar} alt="User Avatar" size={64} />
      <div className="flex mb-2 flex-col">
        <Username name={user.name} username={user.username} />
        <p className="text-gray-700 break-words break-all">{message}</p>
      </div>
    </div>
  );
};

export default Tweet;