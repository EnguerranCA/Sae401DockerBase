import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';
import LikeButton from '../../ui/Buttons/LikeButton';
import ReplyButton from '../../ui/Buttons/ReplyButton';
import ReplyForm from './ReplyForm';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Posts from '../../data/data-posts';
import Users from '../../data/data-users';
import { useNavigate } from 'react-router-dom';
import MediaGallery from '../../ui/Media/MediaGallery';
import { cva } from "class-variance-authority";

const tweetStyles = cva(
  "w-full border-b border-gray-200 p-4",
  {
    variants: {
      variant: {
        tweet: "bg-white",
        reply: "bg-gray-50 pl-8 border-l-2 border-gray-200",
      },
    },
    defaultVariants: {
      variant: 'tweet',
    },
  }
);

const avatarStyles = cva(
  "flex-shrink-0",
  {
    variants: {
      variant: {
        tweet: "w-12 h-12",
        reply: "w-8 h-8",
      },
    },
    defaultVariants: {
      variant: 'tweet',
    },
  }
);

interface TweetProps {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
    avatar: string;
    isReadOnly?: boolean;
  };
  likes: number;
  hasLiked: boolean;
  replyCount: number;
  variant?: 'tweet' | 'reply';
  images?: string[];
  onLike: (postId: number) => void;
  onDelete?: (postId: number) => void;
  replies?: Array<{
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      username: string;
      name: string;
      avatar: string;
    };
    likes: number;
    hasLiked: boolean;
  }>;
}

const Tweet = ({ id, content, createdAt, user, likes, hasLiked, replyCount, variant = 'tweet', images = [], onLike, onDelete, replies = [] }: TweetProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentHasLiked, setHasLiked] = useState(hasLiked);
  const [currentLikes, setLikes] = useState(likes);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(content);
  const [editedImages, setEditedImages] = useState<string[]>(images);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    const checkBlockStatus = async () => {
      try {
        const currentUsername = localStorage.getItem('username');
        if (currentUsername) {
          setIsBlocked(false); // Par défaut, on considère que l'utilisateur n'est pas bloqué
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
    if (onLike) {
      onLike(id);
    }
  };

  const handleCancelEdit = () => {
    setEditedMessage(content);
    setEditedImages(images);
    setIsEditing(false);
  };

  const handleRemoveImage = (index: number) => {
    setEditedImages(editedImages.filter((_, i) => i !== index));
  };

  const handleUserClick = () => {
    navigate(`/profile/${user.username}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  return (
    <div className={tweetStyles({ variant })}>
      <div className="flex gap-2">
        <div className={avatarStyles({ variant })}>
          <Link to={`/profile/${user.username}`}>
            <Avatar
              src={`http://localhost:8080/uploads/avatars/${user.avatar}`}
              alt={user.name}
              size={variant === 'reply' ? 32 : 48}
            />
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <Link to={`/profile/${user.username}`} className="font-bold hover:underline">
              {user.name}
            </Link>
            <Link to={`/profile/${user.username}`} className="text-gray-500">
              @{user.username}
            </Link>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">
              {formatDate(createdAt)}
            </span>
          </div>
          {!isEditing ? (
            <>
              <p className="mt-1">{content}</p>
              {images && images.length > 0 && (
                <MediaGallery variant='medium' images={images} className="w-full mt-2" />
              )}
            </>
          ) : (
            <>
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full p-2 border rounded mt-2"
                rows={3}
              />
              {editedImages.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {editedImages.map((image, index) => (
                    <div key={index} className="relative">
                      {image.endsWith('.mp4') || image.endsWith('.mov') ? (
                        <video
                          src={`http://localhost:8080/uploads/media/${image}`}
                          className="w-full h-32 object-cover rounded-lg"
                          controls
                        />
                      ) : (
                        <img
                          src={`http://localhost:8080/uploads/media/${image}`}
                          alt={`media-${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
                >
                  Save
                </button>
              </div>
            </>
          )}
          <div className="flex items-center gap-4 mt-2">
            {!user.isReadOnly && (
              <ReplyButton
                onClick={handleReply}
                replyCount={replyCount}
                className="text-gray-500 hover:text-primary-hover"
              />
            )}
            <LikeButton
              onClick={() => {
                if (currentHasLiked) {
                  Posts.unlikeOnePost(id);
                  setLikes((prevLikes) => prevLikes - 1);
                } else {
                  Posts.likeOnePost(id);
                  setLikes((prevLikes) => prevLikes + 1);
                }
                setHasLiked(!currentHasLiked);
              }}
              likeCount={currentLikes}
              isLiked={currentHasLiked}
              className="text-gray-500 hover:text-red-500"
            />
            {isUserAuthor && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-primary-hover"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this post?')) {
                      Posts.deleteOnePost(id);
                      if (onDelete) {
                        onDelete(id);
                      }
                    }
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  Delete
                </button>
              </>
            )}
          </div>
          {showReplyForm && (
            <ReplyForm
              tweetId={id}
              onReplyPosted={() => {
                setShowReplyForm(false);
                if (onLike) {
                  onLike(id);
                }
              }}
              className="mt-4"
              user={user}
            />
          )}
          {replies.length > 0 && (
            <div className="w-full mt-4 space-y-2">
              {replies.map((reply) => (
                <Tweet
                  key={reply.id}
                  {...reply}
                  variant="reply"
                  onLike={onLike}
                  replyCount={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tweet;