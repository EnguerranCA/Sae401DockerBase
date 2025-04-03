import React, { useState, useEffect } from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';
import LikeButton from '../../ui/Buttons/LikeButton';

import Users from '../../data/data-users';
import Posts from '../../data/data-posts';
import { useNavigate } from 'react-router-dom';

import ImagesGallery from '../../ui/Media/ImagesGallery';

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
  images?: string[];
}

const Tweet = ({ user, message, likes, hasLiked, id, images }: TweetProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentHasLiked, setHasLiked] = useState(hasLiked);
  const [currentLikes, setLikes] = useState(likes);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-4  bg-white w-full flex gap-4 border border-lightborder animate-pulse">
        <div className="bg-gray-300 rounded-full h-16 w-16"></div>
        <div className="flex mb-2 flex-col gap-2 w-full">
          <div className="bg-gray-300 h-4 w-24 rounded"></div>
          <div className="bg-gray-300 h-4 w-full rounded"></div>
        </div>
      </div>
    );
  }

  let isUserAuthor = false;
  const currentUsername = localStorage.getItem('username');
  if (currentUsername) {
    isUserAuthor = user.username === currentUsername;
  }

  console.log(images)

  return (
    <div className="p-4  bg-white w-full flex flex-col gap-4 border border-lightborder">
      <div className="flex gap-4">
        <Avatar
          src={`http://localhost:8080/uploads/avatars/${user.avatar}`}
          alt="User Avatar"
          size={64}
          className="cursor-pointer"
        />
        <div className="flex mb-2 flex-col w-full">
          <div className='flex justify-between'>
            <Username
              name={user.name}
              username={user.username}
            />
            {isUserAuthor && (
              <button
                className="text-red-500 font-bold"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this post?')) {
                    Posts.deleteOnePost(id);
                  }
                }}
              >
                Delete
              </button>)}
          </div>
          <p className="text-gray-700 break-words break-all">{message}</p>
        </div>
      </div>
      {images && <ImagesGallery variant='medium' images={images} className="w-full" /> }

      <LikeButton
        number={currentLikes.toString()}
        hasLiked={currentHasLiked}
        onClick={(newHasLiked) => {
          if (newHasLiked) {
            Posts.likeOnePost(id);
            setLikes((prevLikes) => prevLikes + 1);
          } else {
            Posts.unlikeOnePost(id);
            setLikes((prevLikes) => prevLikes - 1);
          }
          // Update the state to trigger a rerender
          setHasLiked(newHasLiked);
        }}
      />
    </div>
  );
};

export default Tweet;