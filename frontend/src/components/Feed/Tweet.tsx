import React from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';

interface TweetProps {
  username: string;
  message: string;
}

const Tweet = ({ username, message }: TweetProps,) => {
  return (
    <div className=" p-4 rounded-lg bg-white w-full flex gap-4">
      <Avatar src="../src/assets/images/default_pp.png" alt="User Avatar" size={64} />

      <div className="flex mb-2 flex-col">
        <Username name="User" username={username} />
        <p className="text-gray-700">{message}</p>
      </div>

    </div>
  );
};

export default Tweet;
