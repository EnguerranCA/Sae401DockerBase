import React from 'react';

interface TweetProps {
  username: string;
  message: string;
}

const Tweet = ({ username, message }: TweetProps) => {
  return (
    <div className="border p-4 rounded-lg bg-white w-full">
      <div className="flex items-center mb-2">
        <img
          src="./src/assets/images/default_pp.png"
          alt="Logo twitter"
          className="h-6 w-6 mr-2"
        />
        <span className="font-bold text-lg text-gray-900">@{username}</span>
      </div>
      <p className="text-gray-700">{message}</p>
    </div>
  );
};

export default Tweet;
