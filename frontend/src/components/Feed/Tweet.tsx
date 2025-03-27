import React, { useState, useEffect } from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';
import LikeButton from '../../ui/Buttons/LikeButton';

import Posts from '../../data/data-posts';

interface TweetProps {
  message: string;
  user: {
    avatar: string;
    name: string;
    username: string;
  };
  likes: number;
  hasLiked: boolean;
  id: number;
}

const Tweet = ({ user, message, likes, hasLiked, id }: TweetProps) => {
  const [loading, setLoading] = useState(true);
  const [currentHasLiked, setHasLiked] = useState(hasLiked);

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
    <div className="p-4  bg-white w-full flex flex-col gap-4 border">
      <div className="flex gap-4">
      <Avatar src={user.avatar} alt="User Avatar" size={64} />
      <div className="flex mb-2 flex-col">
        <Username name={user.name} username={user.username} />
        <p className="text-gray-700 break-words break-all">{message}</p>
      </div>
      </div>
      <LikeButton
      number={likes.toString()}
      hasLiked={currentHasLiked}
      onClick={(newHasLiked) => {
        if (newHasLiked) {
        Posts.likeOnePost(id);
        } else {
        Posts.unlikeOnePost(id);
        }
        // Update the state to trigger a rerender
        setHasLiked(newHasLiked);
      }}
      />
    </div>
  );
};

export default Tweet;