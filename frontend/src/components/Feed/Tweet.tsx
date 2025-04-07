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
import ImagesGallery from '../../ui/Media/ImagesGallery';

interface TweetProps {
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
  replyCount: number;
  isReply?: boolean;
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

const Tweet = ({ id, content, createdAt, user, likes, hasLiked, replyCount, isReply = false, images = [], onLike, onDelete, replies = [] }: TweetProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentHasLiked, setHasLiked] = useState(hasLiked);
  const [currentLikes, setLikes] = useState(likes);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(content);
  const [editedImages, setEditedImages] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

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
    if (onLike) {
      onLike(id);
    }
  };

  const handleCancelEdit = () => {
    setEditedMessage(content);
    setEditedImages([]);
    setIsEditing(false);
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
    <div className={`w-full border-b border-gray-200 p-4 ${isReply ? 'bg-gray-50' : ''}`}>
      <div className="flex gap-2">
        <div className="flex-shrink-0">
          <Link to={`/profile/${user.username}`}>
            <Avatar
              src={`http://localhost:8080/uploads/avatars/${user.avatar}`}
              alt={user.name}
              size={isReply ? 32 : 48}
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
          <p className="mt-1">{content}</p>
          {images && images.length > 0 && (
            <ImagesGallery variant='medium' images={images} className="w-full mt-2" />
          )}
          <div className="flex items-center gap-4 mt-2">
            <ReplyButton
              onClick={handleReply}
              replyCount={replyCount}
              className="text-gray-500 hover:text-blue-500"
            />
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
                  className="text-gray-500 hover:text-blue-500"
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
          {isEditing && (
            <div className="mt-4">
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          )}
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
            />
          )}
          {replies.length > 0 && (
            <div className="w-full mt-4 space-y-2 pl-8 border-l-2 border-gray-200">
              {replies.map((reply) => (
                <Tweet
                  key={reply.id}
                  {...reply}
                  isReply={true}
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