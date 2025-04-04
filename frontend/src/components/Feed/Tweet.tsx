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
  onUpdate?: () => void;
}

const Tweet = ({ user, message, likes, hasLiked, id, images, onUpdate }: TweetProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentHasLiked, setHasLiked] = useState(hasLiked);
  const [currentLikes, setLikes] = useState(likes);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const [editedImages, setEditedImages] = useState<string[]>(images || []);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const currentUser = await Users.getCurrentUserInfo();
        if (currentUser && currentUser.blockedUsers) {
          setIsBlocked(currentUser.blockedUsers.some((blockedUser: any) => blockedUser.username === user.username));
        }
      } catch (error) {
        console.error('Error checking block status:', error);
      }
    };
    checkBlockStatus();
  }, [user.username]);

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

  const handleSaveEdit = async () => {
    await Posts.updatePost(id, editedMessage, editedImages);
    setIsEditing(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleCancelEdit = () => {
    setEditedMessage(message);
    setEditedImages(images || []);
    setIsEditing(false);
  };

  const handleUserClick = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className="p-4  bg-white w-full flex flex-col gap-4 border border-lightborder">
      <div className="flex gap-4">
        <div onClick={handleUserClick} className="cursor-pointer w-24 h-24">
          <Avatar
            src={`http://localhost:8080/uploads/avatars/${user.avatar}`}
            alt="User Avatar"
            size={64}
          />
        </div>
        <div className="flex mb-2 flex-col w-full">
          <div className='flex justify-between'>
            <div onClick={handleUserClick} className="cursor-pointer">
              <Username
                name={user.name}
                username={user.username}
              />
            </div>
            {isUserAuthor && (
              <div className="flex gap-2">
                <button
                  className="text-blue-500 font-bold"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this post?')) {
                      Posts.deleteOnePost(id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full p-2 border rounded"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 break-words break-all">{message}</p>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          {editedImages.length > 0 && <ImagesGallery variant='medium' images={editedImages} className="w-full" />}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setEditedImages([])}
            >
              Remove Images
            </button>
          </div>
        </div>
      ) : (
        images && <ImagesGallery variant='medium' images={images} className="w-full" />
      )}

      {!isBlocked && (
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
            setHasLiked(newHasLiked);
          }}
        />
      )}
    </div>
  );
};

export default Tweet;